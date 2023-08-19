import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { UserRegistrationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { RegisterAdminCommand } from './register-admin.dto';
import { RegisterAdminFailure } from './register-admin.result';

@Injectable()
export class RegisterAdminValidator extends ValidatorBase<
  RegisterAdminCommand,
  RegisterAdminFailure
> {
  command: RegisterAdminCommand;
  constructor(
    private readonly userManagementService: UserRegistrationDomainService,
  ) {
    super();
  }

  async validate(
    command: RegisterAdminCommand,
  ): Promise<Notification<RegisterAdminFailure>> {
    this.command = command;
    const note = new Notification<RegisterAdminFailure>();

    await this.userNameMustBeUnique(note);

    return note;
  }

  async userNameMustBeUnique(
    note: Notification<RegisterAdminFailure>,
  ): Promise<void> {
    const exist = await this.userManagementService.isUserNameExistByName(
      this.command.username,
    );

    if (exist) {
      note.addException(new UserDomainExceptions.UsernameAlreadyExists());
    }
  }
}
