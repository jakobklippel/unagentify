import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoopstackApiModule } from '@loopstack/api';
import { CliModule } from '@loopstack/cli-module';
import { LoopCoreModule } from '@loopstack/core';
import { QuotaModule } from '@loopstack/quota';
import { RemoteFileExplorerModule } from '@loopstack/remote-file-explorer-module';
import { DefaultModule } from './default.module';
import { loopstackConfig } from './loopstack.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: loopstackConfig,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      database: process.env.DATABASE_NAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'admin',
      autoLoadEntities: true,
      synchronize: true, // todo enable and provide migrations
      migrationsRun: false,
    }),
    EventEmitterModule.forRoot(),
    QuotaModule.forRootAsync(),
    LoopCoreModule,
    LoopstackApiModule.register({
      swagger: { enabled: process.env.SWAGGER_ENABLED !== 'false' },
      cors: {
        enabled: process.env.CORS_ENABLED !== 'false',
        options: process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN, credentials: true } : undefined,
      },
      availableEnvironments:
        process.env.ENABLE_LOCAL_ENVIRONMENTS === 'true'
          ? [
              {
                type: 'sandbox',
                name: 'Development Sandbox',
                connectionUrl: process.env.SANDBOX_URL ?? 'http://localhost:3080',
                agentUrl: process.env.SANDBOX_AGENT_URL ?? 'http://localhost:3031',
                local: true,
              },
            ]
          : [],
    }),
    CliModule,
    RemoteFileExplorerModule,
    // Custom Workflow Modules:
    DefaultModule,
  ],
})
export class AppModule {}
