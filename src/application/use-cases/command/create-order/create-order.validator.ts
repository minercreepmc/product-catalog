import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  authServiceDiToken,
  AuthServicePort,
} from '@domain-interfaces/services';
import { ProductVerificationDomainService } from '@domain-services';
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
    private readonly productVerificationService: ProductVerificationDomainService,
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
    await this.productsMustExist(note);

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

  async productsMustExist(
    note: Notification<CreateOrderFailure>,
  ): Promise<void> {
    const exist = await this.productVerificationService.doesProductIdsExist(
      this.command.productIds,
    );

    if (!exist) {
      note.addException(new ProductDomainExceptions.DoesNotExist());
    }
  }
}
