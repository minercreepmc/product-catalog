import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { UserRegistrationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { RegisterMemberCommand } from './register-member.dto';
import { RegisterMemberFailure } from './register-member.result';

@Injectable()
export class RegisterMemberValidator extends ValidatorBase<
  RegisterMemberCommand,
  RegisterMemberFailure
> {
  command: RegisterMemberCommand;
  constructor(
    private readonly userManagementService: UserRegistrationDomainService,
  ) {
    super();
  }

  async validate(
    command: RegisterMemberCommand,
  ): Promise<Notification<RegisterMemberFailure>> {
    this.command = command;
    const note = new Notification<RegisterMemberFailure>();

    await this.userNameMustBeUnique(note);

    return note;
  }

  async userNameMustBeUnique(
    note: Notification<RegisterMemberFailure>,
  ): Promise<void> {
    const exist = await this.userManagementService.isUserNameExistByName(
      this.command.username,
    );

    if (exist) {
      note.addException(new UserDomainExceptions.UsernameAlreadyExists());
    }
  }
}
