import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { DiscountManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { RemoveDiscountsCommand } from './remove-discounts.dto';
import { RemoveDiscountsFailure } from './remove-discounts.result';

@Injectable()
export class RemoveDiscountsValidator
  implements ValidatorBase<RemoveDiscountsCommand, RemoveDiscountsFailure>
{
  async validate(
    command: RemoveDiscountsCommand,
  ): Promise<Notification<RemoveDiscountsFailure>> {
    this.command = command;

    const note = new Notification<RemoveDiscountsFailure>();

    await this.discountsMustExist(note);

    return note;
  }

  async discountsMustExist(note: Notification<RemoveDiscountsFailure>) {
    const isExist = await this.discountManagementService.doesDiscountExistByIds(
      this.command.ids,
    );

    if (!isExist) {
      note.addException(new DiscountDomainExceptions.DoesNotExist());
    }
    return note;
  }

  private command: RemoveDiscountsCommand;
  constructor(
    private readonly discountManagementService: DiscountManagementDomainService,
  ) {}
}
