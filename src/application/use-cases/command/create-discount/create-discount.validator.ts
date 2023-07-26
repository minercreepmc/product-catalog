import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { DiscountManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { Result } from 'oxide.ts';
import {
  CreateDiscountCommand,
  CreateDiscountResponseDto,
} from './create-discount.dto';

export type CreateDiscountSuccess = CreateDiscountResponseDto;
export type CreateDiscountFailure =
  Array<DiscountDomainExceptions.AlreadyExist>;
export type CreateDiscountResult = Result<
  CreateDiscountSuccess,
  CreateDiscountFailure
>;

@Injectable()
export class CreateDiscountValidator extends ValidatorBase<
  CreateDiscountCommand,
  CreateDiscountFailure
> {
  async validate(command: CreateDiscountCommand) {
    this.command = command;

    const note = new Notification<CreateDiscountFailure>();

    await this.nameMustBeUnique(note);
    return note;
  }

  private async nameMustBeUnique(note: Notification<CreateDiscountFailure>) {
    const isExist = await this.discountManagement.doesDiscountExistByName(
      this.command.name,
    );

    if (isExist) {
      note.addException(new DiscountDomainExceptions.AlreadyExist());
    }
  }

  command: CreateDiscountCommand;
  constructor(
    private readonly discountManagement: DiscountManagementDomainService,
  ) {
    super();
  }
}
