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
  CreateProductCommand,
  CreateProductResponseDto,
} from './create-product.dto';

export type CreateProductSuccess = CreateProductResponseDto;
export type CreateProductFailure = Array<
  ProductDomainExceptions.AlreadyExist | CategoryDomainExceptions.DoesNotExist
>;
export type CreateProductResult = Result<
  CreateProductSuccess,
  CreateProductFailure
>;

@Injectable()
export class CreateProductValidator extends ValidatorBase<
  CreateProductCommand,
  CreateProductFailure
> {
  async validate(command: CreateProductCommand) {
    const { categoryIds, discountId } = command;
    this.command = command;

    const note = new Notification<CreateProductFailure>();
    await this.nameMustBeUnique(note);
    categoryIds && (await this.categoryIdsMustExist(note));
    discountId && (await this.discountIdMustExist(note));
    return note;
  }

  private async nameMustBeUnique(
    note: Notification<CreateProductFailure>,
  ): Promise<void> {
    const isExist = await this.productVerificationService.doesProductNameExist(
      this.command.name,
    );

    if (isExist) {
      note.addException(new ProductDomainExceptions.AlreadyExist());
    }
  }

  private async categoryIdsMustExist(note: Notification<CreateProductFailure>) {
    const isExist = await this.cateogryVerificationService.doesCategoryIdsExist(
      this.command.categoryIds!,
    );

    if (!isExist) {
      note.addException(new CategoryDomainExceptions.DoesNotExist());
    }
  }

  private async discountIdMustExist(note: Notification<CreateProductFailure>) {
    const isExist = await this.discountVerificationService.doesDiscountIdExist(
      this.command.discountId!,
    );

    if (!isExist) {
      note.addException(new DiscountDomainExceptions.DoesNotExist());
    }
  }

  command: CreateProductCommand;
  constructor(
    private readonly productVerificationService: ProductVerificationDomainService,
    private readonly cateogryVerificationService: CategoryVerificationDomainService,
    private readonly discountVerificationService: DiscountVerificationDomainService,
  ) {
    super();
  }
}
