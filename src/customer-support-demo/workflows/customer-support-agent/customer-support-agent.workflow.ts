import { z } from 'zod';
import {
  ClaudeGenerateObject,
  ClaudeGenerateText,
  ClaudeGenerateTextResult,
  ClaudeMessageDocument,
  DelegateToolCalls,
  DelegateToolCallsResult,
  UpdateToolResult,
} from '@loopstack/claude-module';
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
import { SupportResponseDocument, SupportResponseDocumentType } from '../../documents/support-response-document';
import { CustomerLookupTool } from '../../tools/customer-lookup.tool';
import { DeviceStatusTool } from '../../tools/device-status.tool';
import { KnowledgeBaseSearchTool } from '../../tools/knowledge-base-search.tool';
import { KnownIssuesLookupTool } from '../../tools/known-issues-lookup.tool';
import { OrderLookupTool } from '../../tools/order-lookup.tool';
import { ProductLookupTool } from '../../tools/product-lookup.tool';
import { SubscriptionLookupTool } from '../../tools/subscription-lookup.tool';

const CustomerSupportSchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
});

type CustomerSupportArgs = z.infer<typeof CustomerSupportSchema>;

@Workflow({
  uiConfig: __dirname + '/customer-support-agent.ui.yaml',
  schema: CustomerSupportSchema,
})
export class CustomerSupportAgentWorkflow extends BaseWorkflow {
  @InjectTool() claudeGenerateText: ClaudeGenerateText;
  @InjectTool() claudeGenerateObject: ClaudeGenerateObject;
  @InjectTool() delegateToolCalls: DelegateToolCalls;
  @InjectTool() updateToolResult: UpdateToolResult;
  @InjectTool() customerLookup: CustomerLookupTool;
  @InjectTool() orderLookup: OrderLookupTool;
  @InjectTool() productLookup: ProductLookupTool;
  @InjectTool() subscriptionLookup: SubscriptionLookupTool;
  @InjectTool() deviceStatus: DeviceStatusTool;
  @InjectTool() knowledgeBaseSearch: KnowledgeBaseSearchTool;
  @InjectTool() knownIssuesLookup: KnownIssuesLookupTool;

  args?: CustomerSupportArgs;
  llmResult?: ClaudeGenerateTextResult;
  delegateResult?: DelegateToolCallsResult;

  @Initial({ to: 'ready' })
  async setup(args: CustomerSupportArgs) {
    this.args = args;

    await this.repository.save(
      ClaudeMessageDocument,
      {
        role: 'user',
        content: this.render(__dirname + '/templates/context.md', {
          name: args.name,
          email: args.email,
          message: args.message,
        }),
      },
      { meta: { hidden: true } },
    );
  }

  @Transition({ from: 'ready', to: 'prompt_executed' })
  async llmTurn() {
    const result = await this.claudeGenerateText.call({
      system: this.render(__dirname + '/templates/system.md'),
      claude: {
        model: 'claude-sonnet-4-6',
        cache: true,
      },
      messagesSearchTag: 'message',
      tools: [
        'customerLookup',
        'orderLookup',
        'productLookup',
        'subscriptionLookup',
        'deviceStatus',
        'knowledgeBaseSearch',
        'knownIssuesLookup',
      ],
    });
    this.llmResult = result.data as ClaudeGenerateTextResult;
  }

  // ── Tool call handling ──

  @Transition({ from: 'prompt_executed', to: 'awaiting_tools', priority: 10 })
  @Guard('hasToolCalls')
  async executeToolCalls() {
    const result = await this.delegateToolCalls.call({
      message: this.llmResult!,
      document: ClaudeMessageDocument,
      callback: { transition: 'toolResultReceived' },
    });
    this.delegateResult = result.data as DelegateToolCallsResult;
  }

  @Transition({ from: 'awaiting_tools', to: 'awaiting_tools', wait: true })
  async toolResultReceived(payload: unknown) {
    const result = await this.updateToolResult.call({
      delegateResult: this.delegateResult!,
      completedTool: payload,
      document: ClaudeMessageDocument,
    });
    this.delegateResult = result.data as DelegateToolCallsResult;
  }

  @Transition({ from: 'awaiting_tools', to: 'ready' })
  @Guard('allToolsComplete')
  async continueAfterTools() {}

  // ── Agent done → extract structured response ──

  @Transition({ from: 'prompt_executed', to: 'extracting_response' })
  @Guard('noToolCalls')
  async saveAgentOutput() {
    await this.repository.save(ClaudeMessageDocument, this.llmResult!, {
      id: this.llmResult!.id,
    });
  }

  @Final({ from: 'extracting_response' })
  async composeResponse() {
    const agentText = this.extractTextResponse(this.llmResult!);

    const result = await this.claudeGenerateObject.call({
      system:
        'Extract the final customer-facing response from the agent output below. ' +
        'Return only the message that should be sent to the customer — no internal notes, reasoning, or tool call references.',
      prompt: agentText,
      claude: {
        model: 'claude-sonnet-4-6',
      },
      response: {
        document: SupportResponseDocument,
      },
    });

    const data = result.data as SupportResponseDocumentType;

    const markdown = [
      `# Support Response`,
      ``,
      `**To:** ${this.args!.name} (${this.args!.email})`,
      ``,
      `---`,
      ``,
      data.response,
    ].join('\n');

    await this.repository.save(MarkdownDocument, { markdown });

    return { response: data.response };
  }

  // ── Guards ──

  private hasToolCalls(): boolean {
    return this.llmResult?.stop_reason === 'tool_use';
  }

  private noToolCalls(): boolean {
    return this.llmResult?.stop_reason !== 'tool_use';
  }

  private allToolsComplete(): boolean {
    return !!this.delegateResult?.allCompleted;
  }

  private extractTextResponse(result: ClaudeGenerateTextResult): string {
    if (!result.content) return '';
    return result.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text as string)
      .join('\n\n');
  }
}
