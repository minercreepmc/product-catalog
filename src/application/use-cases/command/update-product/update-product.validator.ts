import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  CategoryVerificationDomainService,
  DiscountVerificationDomainService,
  ProductVerificationDomainService,
} from '@domain-services';
import { Injectable } from '@nestjs/common';
import { Result } from 'oxide.ts';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from './update-product.dto';

export type UpdateProductSuccess = UpdateProductResponseDto;
export type UpdateProductFailure = Array<
  | ProductDomainExceptions.DoesNotExist
  | DiscountDomainExceptions.DoesNotExist
  | CategoryDomainExceptions.DoesNotExist
>;

export type UpdateProductResult = Result<
  UpdateProductSuccess,
  UpdateProductFailure
>;

@Injectable()
export class UpdateProductValidator extends ValidatorBase<
  UpdateProductCommand,
  UpdateProductFailure
> {
  async validate(
    command: UpdateProductCommand,
  ): Promise<Notification<UpdateProductFailure>> {
    this.command = command;

    const note = new Notification<UpdateProductFailure>();

    await this.productIdMustExist(note);
    command.discountId && (await this.discountIdMustExist(note));
    command.categoryIds && (await this.categoryIdsMustExist(note));

    return note;
  }

  private async productIdMustExist(note: Notification<UpdateProductFailure>) {
    const isExist = await this.productVerificationService.doesProductIdExist(
      this.command.id,
    );

    if (!isExist) {
      note.addException(new ProductDomainExceptions.DoesNotExist());
    }
  }

  private async discountIdMustExist(note: Notification<UpdateProductFailure>) {
    const isExist = await this.discoutVerificationService.doesDiscountIdExist(
      this.command.discountId!,
    );

    if (!isExist) {
      note.addException(new DiscountDomainExceptions.DoesNotExist());
    }
  }

  private async categoryIdsMustExist(note: Notification<UpdateProductFailure>) {
    const isExist = await this.categoryVerificationService.doesCategoryIdsExist(
      this.command.categoryIds!,
    );

    if (!isExist) {
      note.addException(new CategoryDomainExceptions.DoesNotExist());
    }
  }

  command: UpdateProductCommand;
  constructor(
    private readonly productVerificationService: ProductVerificationDomainService,
    private readonly discoutVerificationService: DiscountVerificationDomainService,
    private readonly categoryVerificationService: CategoryVerificationDomainService,
  ) {
    super();
  }
}
