import { Injectable } from '@nestjs/common';
import { InjectWorkflow, Workspace, WorkspaceInterface } from '@loopstack/common';
import { SupportBatchRunnerWorkflow } from './demo/workflows/support-batch-runner/support-batch-runner.workflow';

@Injectable()
@Workspace({
  uiConfig: {
    title: 'Default',
    features: {
      previewPanel: { enabled: true },
      fileExplorer: {
        enabled: true,
        environments: ['ls-sandbox'],
      },
      git: {
        enabled: true,
        environments: ['ls-sandbox'],
      },
      workflowHistory: {
        enabled: true,
      },
    },
    environments: [
      {
        id: 'ls-sandbox',
        title: 'Development Sandbox',
        type: 'sandbox',
      },
    ],
  },
})
export class DefaultWorkspace implements WorkspaceInterface {
  @InjectWorkflow() supportBatchRunner: SupportBatchRunnerWorkflow;
}
