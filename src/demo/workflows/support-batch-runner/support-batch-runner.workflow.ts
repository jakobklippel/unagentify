import { z } from 'zod';
import {
  BaseWorkflow,
  CallbackSchema,
  Final,
  Guard,
  Initial,
  InjectWorkflow,
  LinkDocument,
  MarkdownDocument,
  QueueResult,
  Transition,
  Workflow,
} from '@loopstack/common';
import { TestTicket, testTickets } from '../../data/tickets';
import { EvaluationResult } from '../../documents/evaluation-document';
import { CustomerSupportAgentWorkflow } from '../customer-support-agent/customer-support-agent.workflow';
import { ImprovementAdvisorWorkflow } from '../improvement-advisor/improvement-advisor.workflow';
import { SupportEvaluatorWorkflow } from '../support-evaluator/support-evaluator.workflow';

const AgentCallbackSchema = CallbackSchema.extend({
  data: z.object({ response: z.string() }),
});
type AgentCallback = z.infer<typeof AgentCallbackSchema>;

const EvaluatorCallbackSchema = CallbackSchema.extend({
  data: z.object({ evaluation: z.unknown() }),
});
type EvaluatorCallback = z.infer<typeof EvaluatorCallbackSchema>;

const AdvisorCallbackSchema = CallbackSchema.extend({
  data: z.object({ concept: z.string() }),
});
type AdvisorCallback = z.infer<typeof AdvisorCallbackSchema>;

interface TicketResult {
  ticketId: string;
  name: string;
  email: string;
  response: string;
}

@Workflow({
  uiConfig: __dirname + '/support-batch-runner.ui.yaml',
  schema: z.object({}).optional(),
})
export class SupportBatchRunnerWorkflow extends BaseWorkflow {
  @InjectWorkflow() customerSupportAgent: CustomerSupportAgentWorkflow;
  @InjectWorkflow() supportEvaluator: SupportEvaluatorWorkflow;
  @InjectWorkflow() improvementAdvisor: ImprovementAdvisorWorkflow;

  tickets: TestTicket[] = [];
  currentIndex: number = 0;
  results: TicketResult[] = [];
  evaluation?: EvaluationResult;

  // ── Phase 1: Run all tickets ──

  @Initial({ to: 'ticket_queued' })
  async setup() {
    this.tickets = [...testTickets];
    this.currentIndex = 0;
    this.results = [];

    await this.runTicket(this.tickets[0]);
  }

  @Transition({
    from: 'ticket_queued',
    to: 'ticket_complete',
    wait: true,
    schema: AgentCallbackSchema,
  })
  async agentCallback(payload: AgentCallback) {
    const ticket = this.tickets[this.currentIndex];

    this.results.push({
      ticketId: ticket.id,
      name: ticket.name,
      email: ticket.email,
      response: payload.data.response,
    });

    await this.repository.save(
      LinkDocument,
      {
        label: `[${ticket.id}] ${ticket.title} — done`,
        workflowId: payload.workflowId,
        embed: true,
        expanded: false,
      },
      { id: `ticket_link_${ticket.id}` },
    );

    this.currentIndex++;
  }

  @Transition({ from: 'ticket_complete', to: 'ticket_queued' })
  @Guard('hasMoreTickets')
  async runNextTicket() {
    await this.runTicket(this.tickets[this.currentIndex]);
  }

  // ── Phase 2: Evaluate ──

  @Transition({ from: 'ticket_complete', to: 'evaluating' })
  @Guard('allTicketsDone')
  async runEvaluator() {
    const evaluatorInput = this.results.map((r) => {
      const ticket = this.tickets.find((t) => t.id === r.ticketId)!;
      return {
        ticketId: r.ticketId,
        category: ticket.category,
        title: ticket.title,
        message: ticket.message,
        agentResponse: r.response,
        expectedResolution: ticket.expected.expectedResolution,
        requiredFacts: ticket.expected.requiredFacts,
        pitfalls: ticket.expected.pitfalls,
      };
    });

    const result: QueueResult = await this.supportEvaluator.run(
      { tickets: evaluatorInput },
      { alias: 'supportEvaluator', callback: { transition: 'evaluatorCallback' } },
    );

    await this.repository.save(
      LinkDocument,
      {
        label: 'Evaluating results',
        workflowId: result.workflowId,
        embed: true,
        expanded: true,
      },
      { id: 'evaluator_link' },
    );
  }

  @Transition({
    from: 'evaluating',
    to: 'evaluation_complete',
    wait: true,
    schema: EvaluatorCallbackSchema,
  })
  async evaluatorCallback(payload: EvaluatorCallback) {
    this.evaluation = payload.data.evaluation as EvaluationResult;

    await this.repository.save(
      LinkDocument,
      {
        label: 'Evaluation complete',
        workflowId: payload.workflowId,
        embed: true,
        expanded: false,
      },
      { id: 'evaluator_link' },
    );

    // Display evaluation summary in the main workflow
    await this.repository.save(MarkdownDocument, {
      markdown: this.buildEvaluationMarkdown(this.evaluation),
    });
  }

  // ── Phase 3: Improvement Advisor ──

  @Transition({ from: 'evaluation_complete', to: 'advising' })
  async runAdvisor() {
    const result: QueueResult = await this.improvementAdvisor.run(
      { evaluation: this.evaluation },
      { alias: 'improvementAdvisor', callback: { transition: 'advisorCallback' } },
    );

    await this.repository.save(
      LinkDocument,
      {
        label: 'Analysing code & drafting improvements',
        workflowId: result.workflowId,
        embed: true,
        expanded: true,
      },
      { id: 'advisor_link' },
    );
  }

  @Final({
    from: 'advising',
    wait: true,
    schema: AdvisorCallbackSchema,
  })
  async advisorCallback(payload: AdvisorCallback) {
    await this.repository.save(
      LinkDocument,
      {
        label: 'Improvement concept ready',
        workflowId: payload.workflowId,
        embed: true,
        expanded: false,
      },
      { id: 'advisor_link' },
    );

    return {
      results: this.results,
      evaluation: this.evaluation,
      improvementConcept: payload.data.concept,
    };
  }

  // ── Guards ──

  private hasMoreTickets(): boolean {
    return this.currentIndex < this.tickets.length;
  }

  private allTicketsDone(): boolean {
    return this.currentIndex >= this.tickets.length;
  }

  // ── Helpers ──

  private async runTicket(ticket: TestTicket) {
    const result: QueueResult = await this.customerSupportAgent.run(
      { name: ticket.name, email: ticket.email, message: ticket.message },
      { alias: `supportAgent_${ticket.id}`, callback: { transition: 'agentCallback' } },
    );

    await this.repository.save(
      LinkDocument,
      {
        label: `[${ticket.id}] ${ticket.title}`,
        workflowId: result.workflowId,
        embed: true,
        expanded: true,
      },
      { id: `ticket_link_${ticket.id}` },
    );
  }

  private buildEvaluationMarkdown(data: EvaluationResult): string {
    const lines: string[] = [
      '# Evaluation Report',
      '',
      '## KPIs',
      '',
      '| Metric | Score |',
      '|--------|-------|',
      `| Factual Accuracy | ${data.kpis.avgFactualAccuracy}% |`,
      `| Correct Resolution Rate | ${data.kpis.correctResolutionRate}% |`,
      `| Pitfall Avoidance Rate | ${data.kpis.pitfallAvoidanceRate}% |`,
      `| **Overall Score** | **${data.kpis.overallScore}%** |`,
      '',
      '## Per-Ticket Results',
      '',
      '| Ticket | Accuracy | Resolution | Pitfalls | Notes |',
      '|--------|----------|------------|----------|-------|',
    ];

    for (const te of data.ticketEvaluations) {
      const pitfalls = te.noPitfalls ? 'Clean' : te.pitfallsHit.join(', ');
      lines.push(
        `| ${te.ticketId} | ${te.factualAccuracy}% | ${te.correctResolution ? 'Correct' : 'Wrong'} | ${pitfalls} | ${te.notes} |`,
      );
    }

    lines.push('', '## Summary', '', data.summary);

    return lines.join('\n');
  }
}
