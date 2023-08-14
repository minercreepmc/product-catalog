import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { Inject, Injectable } from '@nestjs/common';
import { LogInCommand } from './log-in.dto';
import { LogInFailure } from './log-in.result';

@Injectable()
export class LogInValidator extends ValidatorBase<LogInCommand, LogInFailure> {
  constructor(
    @Inject(authServiceDiToken) private readonly authService: AuthServicePort,
  ) {
    super();
  }

  command: LogInCommand;
  async validate(command: LogInCommand): Promise<Notification<LogInFailure>> {
    this.command = command;
    const note = new Notification<LogInFailure>();

    await this.userNameMustExist(note);

    return note;
  }

  async userNameMustExist(note: Notification<LogInFailure>): Promise<void> {
    const exist = await this.authService.doesUserNameExist(
      this.command.username,
    );

    if (!exist) {
      note.addException(new UserDomainExceptions.CredentialDoesNotValid());
    }
  }
}
