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
import { CustomerSupportAgentWorkflow } from '../customer-support-agent/customer-support-agent.workflow';

const AgentCallbackSchema = CallbackSchema.extend({
  data: z.object({ response: z.string() }),
});
type AgentCallback = z.infer<typeof AgentCallbackSchema>;

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

  tickets: TestTicket[] = [];
  currentIndex: number = 0;
  results: TicketResult[] = [];

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

  @Final({ from: 'ticket_complete' })
  @Guard('allTicketsDone')
  async complete() {
    const markdown = this.buildSummaryMarkdown();
    await this.repository.save(MarkdownDocument, { markdown });
    return { results: this.results };
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

  private buildSummaryMarkdown(): string {
    const lines: string[] = ['# Support Batch Results', '', `**Total tickets:** ${this.results.length}`, '', '---', ''];

    for (const result of this.results) {
      lines.push(`## ${result.ticketId}`);
      lines.push('');
      lines.push(`**To:** ${result.name} (${result.email})`);
      lines.push('');
      lines.push(result.response);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  }
}
