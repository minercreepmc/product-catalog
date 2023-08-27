import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderCommand } from './create-order.dto';
import { CreateOrderFailure } from './create-order.result';

@Injectable()
export class CreateOrderValidator extends ValidatorBase<
  CreateOrderCommand,
  CreateOrderFailure
> {
  constructor(
    @Inject(authServiceDiToken)
    private readonly userManagementService: AuthServicePort,
  ) {
    super();
  }
  command: CreateOrderCommand;
  async validate(
    command: CreateOrderCommand,
  ): Promise<Notification<CreateOrderFailure>> {
    this.command = command;

    const note = new Notification<CreateOrderFailure>();
    await this.userMustExist(note);

    return note;
  }

  async userMustExist(note: Notification<CreateOrderFailure>): Promise<void> {
    const exist = await this.userManagementService.doesUserIdExist(
      this.command.userId,
    );

    if (!exist) {
      note.addException(new UserDomainExceptions.DoesNotExist());
    }
  }
}
