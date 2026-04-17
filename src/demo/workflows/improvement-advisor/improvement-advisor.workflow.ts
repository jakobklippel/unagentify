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

const ImprovementAdvisorSchema = z.object({
  evaluation: z.unknown(),
});

type ImprovementAdvisorArgs = z.infer<typeof ImprovementAdvisorSchema>;

@Workflow({
  uiConfig: __dirname + '/improvement-advisor.ui.yaml',
  schema: ImprovementAdvisorSchema,
})
export class ImprovementAdvisorWorkflow extends BaseWorkflow {
  @InjectTool() claudeGenerateText: ClaudeGenerateText;
  @InjectTool() delegateToolCalls: DelegateToolCalls;
  @InjectTool() updateToolResult: UpdateToolResult;
  @InjectTool() glob: GlobTool;
  @InjectTool() grep: GrepTool;
  @InjectTool() read: ReadTool;

  llmResult?: ClaudeGenerateTextResult;
  delegateResult?: DelegateToolCallsResult;

  @Initial({ to: 'ready' })
  async setup(args: ImprovementAdvisorArgs) {
    await this.repository.save(
      ClaudeMessageDocument,
      {
        role: 'user',
        content: this.render(__dirname + '/templates/context.md', {
          evaluation: args.evaluation,
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

  // ── Final response ──

  @Final({ from: 'prompt_executed' })
  @Guard('noToolCalls')
  async produceReport() {
    const responseText = this.extractTextResponse(this.llmResult!);

    await this.repository.save(ClaudeMessageDocument, this.llmResult!, {
      id: this.llmResult!.id,
    });

    await this.repository.save(MarkdownDocument, { markdown: responseText });

    return { concept: responseText };
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

  // ── Helpers ──

  private extractTextResponse(result: ClaudeGenerateTextResult): string {
    if (!result.content) return '';
    return result.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text as string)
      .join('\n\n');
  }
}
