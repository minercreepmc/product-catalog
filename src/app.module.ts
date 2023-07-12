import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from './modules/infrastructures/database';
import HealthModule from './modules/infrastructures/health-check/health.module';
import { IpcModule } from './modules/infrastructures/ipc';
import { UseCaseModule } from './modules/application/use-cases';
import { EventHandlersModule } from '@modules/application/event-handlers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
    DatabaseModule,
    UseCaseModule,
    EventHandlersModule,
    IpcModule,
    HealthModule,
  ],
})
export class AppModule {}
