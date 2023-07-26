import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { DiscountManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { UpdateDiscountCommand } from './update-discount.dto';
import { UpdateDiscountFailure } from './update-discount.result';

@Injectable()
export class UpdateDiscountValidator extends ValidatorBase<
  UpdateDiscountCommand,
  UpdateDiscountFailure
> {
  async validate(
    command: UpdateDiscountCommand,
  ): Promise<Notification<UpdateDiscountFailure>> {
    this.command = command;
    const note = new Notification<UpdateDiscountFailure>();

    await this.idMustExist(note);

    return note;
  }

  async idMustExist(note: Notification<UpdateDiscountFailure>): Promise<void> {
    const isExist = await this.discountManagementService.doesDiscountExistById(
      this.command.id,
    );

    if (!isExist) {
      note.addException(new DiscountDomainExceptions.DoesNotExist());
    }
  }

  command: UpdateDiscountCommand;
  constructor(
    private readonly discountManagementService: DiscountManagementDomainService,
  ) {
    super();
  }
}
