import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { UserVerificationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { CreateCartCommand } from './create-cart.dto';
import { CreateCartFailure } from './create-cart.result';

@Injectable()
export class CreateCartValidator
  implements ValidatorBase<CreateCartCommand, CreateCartFailure>
{
  constructor(
    private readonly userVerificationService: UserVerificationDomainService,
  ) {}
  command: CreateCartCommand;
  async validate(
    command: CreateCartCommand,
  ): Promise<Notification<CreateCartFailure>> {
    this.command = command;

    const note = new Notification<CreateCartFailure>();

    await this.userMustExist(note);
    return note;
  }

  async userMustExist(note: Notification<CreateCartFailure>) {
    const exist = await this.userVerificationService.doesUserIdExist(
      this.command.userId,
    );

    if (!exist) {
      note.addException(new UserDomainExceptions.DoesNotExist());
    }
  }
}
