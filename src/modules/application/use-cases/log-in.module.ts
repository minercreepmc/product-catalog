import { V1LogInHttpController } from '@controllers/http/v1';
import { V1LogOutHttpController } from '@controllers/http/v1/log-out.http.controller.v1';
import { AuthModule } from '@modules/infrastructures/auth';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { LogInHandler, LogInValidator } from '@use-cases/command/log-in';

const commandHandler: Provider[] = [LogInHandler, LogInValidator];

const controllers = [V1LogInHttpController, V1LogOutHttpController];

const sharedModules = [AuthModule, CqrsModule];

@Module({
  imports: [...sharedModules],
  controllers: [...controllers],
  providers: [...commandHandler],
})
export class LogInModule {}