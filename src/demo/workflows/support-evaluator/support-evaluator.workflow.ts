import { z } from 'zod';
import { ClaudeGenerateObject } from '@loopstack/claude-module';
import {
  BaseWorkflow,
  Final,
  Guard,
  Initial,
  InjectTool,
  MarkdownDocument,
  Transition,
  Workflow,
} from '@loopstack/common';
import {
  EvaluationResult,
  EvaluationSummaryDocument,
  EvaluationSummaryType,
  TicketEvaluationDocument,
  TicketEvaluationType,
} from '../../documents/evaluation-document';

const TicketInputSchema = z.object({
  ticketId: z.string(),
  category: z.string(),
  title: z.string(),
  message: z.string(),
  agentResponse: z.string(),
  expectedResolution: z.string(),
  requiredFacts: z.array(z.string()),
  pitfalls: z.array(z.string()),
});
type TicketInput = z.infer<typeof TicketInputSchema>;

const EvaluatorInputSchema = z.object({
  tickets: z.array(TicketInputSchema),
});
type EvaluatorInput = z.infer<typeof EvaluatorInputSchema>;

@Workflow({
  uiConfig: __dirname + '/support-evaluator.ui.yaml',
  schema: EvaluatorInputSchema,
})
export class SupportEvaluatorWorkflow extends BaseWorkflow {
  @InjectTool() claudeGenerateObject: ClaudeGenerateObject;

  tickets: TicketInput[] = [];
  currentIndex: number = 0;
  evaluations: (TicketEvaluationType & { ticketId: string })[] = [];

  // ── Phase 1: Evaluate tickets one by one ──

  @Initial({ to: 'evaluating_ticket' })
  async setup(args: EvaluatorInput) {
    this.tickets = args.tickets;
    this.currentIndex = 0;
    this.evaluations = [];
  }

  @Transition({ from: 'evaluating_ticket', to: 'ticket_evaluated' })
  async evaluateTicket() {
    const ticket = this.tickets[this.currentIndex];

    const result = await this.claudeGenerateObject.call({
      system: this.render(__dirname + '/templates/system.md'),
      prompt: this.render(__dirname + '/templates/context.md', ticket),
      claude: { model: 'claude-sonnet-4-6' },
      response: { document: TicketEvaluationDocument },
    });

    const data = result.data as TicketEvaluationType;
    this.evaluations.push({ ...data, ticketId: ticket.ticketId });
    this.currentIndex++;
  }

  @Transition({ from: 'ticket_evaluated', to: 'evaluating_ticket' })
  @Guard('hasMoreTickets')
  async nextTicket() {}

  // ── Phase 2: Compute KPIs and generate summary ──

  @Transition({ from: 'ticket_evaluated', to: 'summarizing' })
  @Guard('allTicketsEvaluated')
  async computeKpis() {}

  @Final({ from: 'summarizing' })
  async generateSummary() {
    const kpis = this.computeKpiValues();

    const summaryResult = await this.claudeGenerateObject.call({
      system: this.render(__dirname + '/templates/summary-system.md'),
      prompt: this.render(__dirname + '/templates/summary-context.md', {
        kpis,
        evaluations: this.evaluations,
      }),
      claude: { model: 'claude-sonnet-4-6' },
      response: { document: EvaluationSummaryDocument },
    });

    const summaryData = summaryResult.data as EvaluationSummaryType;

    const evaluation: EvaluationResult = {
      ticketEvaluations: this.evaluations,
      kpis,
      summary: summaryData.summary,
    };

    const markdown = this.buildMarkdown(evaluation);
    await this.repository.save(MarkdownDocument, { markdown });

    return { evaluation };
  }

  // ── Guards ──

  private hasMoreTickets(): boolean {
    return this.currentIndex < this.tickets.length;
  }

  private allTicketsEvaluated(): boolean {
    return this.currentIndex >= this.tickets.length;
  }

  // ── Helpers ──

  private computeKpiValues() {
    const total = this.evaluations.length;
    const avgFactualAccuracy = this.evaluations.reduce((sum, e) => sum + e.factualAccuracy, 0) / total;
    const correctResolutionRate = (this.evaluations.filter((e) => e.correctResolution).length / total) * 100;
    const pitfallAvoidanceRate = (this.evaluations.filter((e) => e.noPitfalls).length / total) * 100;
    const overallScore = avgFactualAccuracy * 0.4 + correctResolutionRate * 0.35 + pitfallAvoidanceRate * 0.25;

    return {
      avgFactualAccuracy: Math.round(avgFactualAccuracy * 10) / 10,
      correctResolutionRate: Math.round(correctResolutionRate * 10) / 10,
      pitfallAvoidanceRate: Math.round(pitfallAvoidanceRate * 10) / 10,
      overallScore: Math.round(overallScore * 10) / 10,
    };
  }

  private buildMarkdown(data: EvaluationResult): string {
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
