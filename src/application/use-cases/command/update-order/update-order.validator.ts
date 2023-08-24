import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { OrderVerificationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { UpdateOrderCommand } from './update-order.dto';
import { UpdateOrderFailure } from './update-order.result';

@Injectable()
export class UpdateOrderValidator extends ValidatorBase<
  UpdateOrderCommand,
  UpdateOrderFailure
> {
  constructor(
    private readonly orderVerificationService: OrderVerificationDomainService,
  ) {
    super();
  }
  command: UpdateOrderCommand;
  async validate(
    command: UpdateOrderCommand,
  ): Promise<Notification<UpdateOrderFailure>> {
    this.command = command;
    const note = new Notification<UpdateOrderFailure>();
    await this.orderMustExist(note);

    return note;
  }

  async orderMustExist(note: Notification<UpdateOrderFailure>): Promise<void> {
    const exist = await this.orderVerificationService.doesOrderExist(
      this.command.id,
    );

    if (!exist) {
      note.addException(new CartDomainExceptions.DoesNotExist());
    }
  }
}
