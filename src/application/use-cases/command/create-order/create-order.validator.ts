import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { CartVerificationDomainService } from '@domain-services';
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
    private readonly cartVerificationService: CartVerificationDomainService,
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
    await this.cartMustExist(note);

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

  async cartMustExist(note: Notification<CreateOrderFailure>): Promise<void> {
    const exist = await this.cartVerificationService.doesCartIdExist(
      this.command.cartId,
    );

    if (!exist) {
      note.addException(new CartDomainExceptions.DoesNotExist());
    }
  }
}
