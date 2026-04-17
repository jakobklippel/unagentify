import { z } from 'zod';
import {
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
import { GlobTool, GrepTool, ReadTool } from '@loopstack/remote-client';

const PlannerInputSchema = z.object({
  concept: z.string(),
});

type PlannerInput = z.infer<typeof PlannerInputSchema>;

@Workflow({
  uiConfig: __dirname + '/implementation-planner.ui.yaml',
  schema: PlannerInputSchema,
})
export class ImplementationPlannerWorkflow extends BaseWorkflow {
  @InjectTool() claudeGenerateText: ClaudeGenerateText;
  @InjectTool() delegateToolCalls: DelegateToolCalls;
  @InjectTool() updateToolResult: UpdateToolResult;
  @InjectTool() glob: GlobTool;
  @InjectTool() grep: GrepTool;
  @InjectTool() read: ReadTool;

  llmResult?: ClaudeGenerateTextResult;
  delegateResult?: DelegateToolCallsResult;

  @Initial({ to: 'ready' })
  async setup(args: PlannerInput) {
    await this.repository.save(
      ClaudeMessageDocument,
      {
        role: 'user',
        content: this.render(__dirname + '/templates/context.md', {
          concept: args.concept,
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
      tools: ['glob', 'grep', 'read'],
    });
    this.llmResult = result.data as ClaudeGenerateTextResult;
  }

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

  @Final({ from: 'prompt_executed' })
  @Guard('noToolCalls')
  async producePlan() {
    const planText = this.extractTextResponse(this.llmResult!);

    await this.repository.save(ClaudeMessageDocument, this.llmResult!, {
      id: this.llmResult!.id,
    });

    await this.repository.save(MarkdownDocument, { markdown: planText });

    return { plan: planText };
  }

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
