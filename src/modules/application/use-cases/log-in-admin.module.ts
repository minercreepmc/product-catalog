import { V1LogInAdminController } from '@controllers/http/v1/log-in-admin.controller.v1';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LogInHandler, LogInValidator } from '@use-cases/command/log-in';

const commandHandler: Provider[] = [LogInHandler, LogInValidator];

const controllers = [V1LogInAdminController];

const sharedModules = [CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class LogInAdminModule {}
