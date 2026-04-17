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
// Customer Support Demo
import { MockDbService } from './customer-support-demo/mock-db.service';
import {
  CustomerLookupTool,
  DeviceStatusTool,
  KnowledgeBaseSearchTool,
  KnownIssuesLookupTool,
  OrderLookupTool,
  ProductLookupTool,
  SubscriptionLookupTool,
} from './customer-support-demo/tools';
import { CustomerSupportAgentWorkflow } from './customer-support-demo/workflows/customer-support-agent/customer-support-agent.workflow';
import { DefaultWorkspace } from './default.workspace';
import { DemoImplementationAgentWorkflow } from './demo/workflows/implementation-agent/implementation-agent.workflow';
import { ImplementationPlannerWorkflow } from './demo/workflows/implementation-planner/implementation-planner.workflow';
import { ImprovementAdvisorWorkflow } from './demo/workflows/improvement-advisor/improvement-advisor.workflow';
import { SupportBatchRunnerWorkflow } from './demo/workflows/support-batch-runner/support-batch-runner.workflow';
import { SupportEvaluatorWorkflow } from './demo/workflows/support-evaluator/support-evaluator.workflow';

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
    // Customer Support Demo
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
    SupportEvaluatorWorkflow,
    ImprovementAdvisorWorkflow,
    ImplementationPlannerWorkflow,
    DemoImplementationAgentWorkflow,
  ],
})
export class DefaultModule {}
