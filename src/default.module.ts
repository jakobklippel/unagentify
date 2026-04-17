import { Module } from '@nestjs/common';
import { ClaudeModule } from '@loopstack/claude-module';
import { CodeAgentModule } from '@loopstack/code-agent';
import { LoopCoreModule } from '@loopstack/core';
import { GitModule } from '@loopstack/git-module';
import { GitHubIntegrationModule } from '@loopstack/github-integration';
import { GitHubModule } from '@loopstack/github-module';
import { HitlModule } from '@loopstack/hitl';
import { OAuthModule } from '@loopstack/oauth-module';
import { RemoteClientModule } from '@loopstack/remote-client';
import { SecretsModule } from '@loopstack/secrets-module';
import { DefaultWorkspace } from './default.workspace';
// Demo — Customer Support
import { MockDbService } from './demo/mock-db.service';
import {
  CustomerLookupTool,
  DeviceStatusTool,
  KnowledgeBaseSearchTool,
  KnownIssuesLookupTool,
  OrderLookupTool,
  ProductLookupTool,
  SubscriptionLookupTool,
} from './demo/tools';
import { CustomerSupportAgentWorkflow } from './demo/workflows/customer-support-agent/customer-support-agent.workflow';
import { SupportBatchRunnerWorkflow } from './demo/workflows/support-batch-runner/support-batch-runner.workflow';

@Module({
  imports: [
    LoopCoreModule,
    SecretsModule,
    ClaudeModule,
    RemoteClientModule,
    CodeAgentModule,
    HitlModule,
    GitModule,
    OAuthModule,
    GitHubModule,
    GitHubIntegrationModule,
  ],
  providers: [
    DefaultWorkspace,
    // Demo — Customer Support
    MockDbService,
    CustomerLookupTool,
    OrderLookupTool,
    ProductLookupTool,
    SubscriptionLookupTool,
    DeviceStatusTool,
    KnowledgeBaseSearchTool,
    KnownIssuesLookupTool,
    CustomerSupportAgentWorkflow,
    SupportBatchRunnerWorkflow,
  ],
})
export class DefaultModule {}
