import { CommandHandlerBase } from '@base/use-cases/command-handler/command-handler.base';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { LogInCommand, LogInResponseDto } from './log-in.dto';
import { LogInFailure, LogInSuccess } from './log-in.result';
import { LogInValidator } from './log-in.validator';

@CommandHandler(LogInCommand)
export class LogInHandler extends CommandHandlerBase<
  LogInCommand,
  LogInSuccess,
  LogInFailure
> {
  protected command: LogInCommand;
  async handle(): Promise<any> {
    const user = await this.authService.findOneByUsername(
      this.command.username,
    );
    const cookie = this.authService.getAuthenticatedCookie(user!.id);
    return cookie;
  }
  toResponseDto(data: any): LogInResponseDto {
    return new LogInResponseDto({
      cookie: data,
    });
  }

  constructor(
    validator: LogInValidator,
    @Inject(authServiceDiToken) private readonly authService: AuthServicePort,
  ) {
    super(validator);
  }
}
