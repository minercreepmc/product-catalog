import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { DiscountVerificationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { RemoveDiscountCommand } from './remove-discount.dto';
import { RemoveDiscountFailure } from './remove-discount.result';

@Injectable()
export class RemoveDiscountValidator extends ValidatorBase<
  RemoveDiscountCommand,
  RemoveDiscountFailure
> {
  constructor(
    private readonly discountVerificationService: DiscountVerificationDomainService,
  ) {
    super();
  }
  command: RemoveDiscountCommand;
  async validate(
    command: RemoveDiscountCommand,
  ): Promise<Notification<RemoveDiscountFailure>> {
    const note = new Notification<RemoveDiscountFailure>();
    this.command = command;
    await this.discountMustExist(note);

    return note;
  }

  async discountMustExist(note: Notification<RemoveDiscountFailure>) {
    const exist = await this.discountVerificationService.doesDiscountIdExist(
      this.command.id,
    );
    if (!exist) {
      note.addException(new DiscountDomainExceptions.DoesNotExist());
    }
  }
}
