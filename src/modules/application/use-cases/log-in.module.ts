import { V1LogInHttpController } from '@controllers/http/v1';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LogInHandler, LogInValidator } from '@use-cases/command/log-in';
import { ApplicationServiceModule } from '../application-services.module';

const commandHandler: Provider[] = [LogInHandler, LogInValidator];

const controllers = [V1LogInHttpController];

const sharedModules = [ApplicationServiceModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class LogInModule {}
