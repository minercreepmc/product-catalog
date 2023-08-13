import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { CategoryVerificationDomainService } from '@domain-services';
import { ProductVerificationDomainService } from '@domain-services/product-verification.domain-service';
import { Injectable } from '@nestjs/common';
import { UpdateCategoryCommand } from './update-category.dto';
import { UpdateCategoryFailure } from './update-category.result';

@Injectable()
export class UpdateCategoryValidator
  implements ValidatorBase<UpdateCategoryCommand, UpdateCategoryFailure>
{
  constructor(
    private readonly categoryVerificationService: CategoryVerificationDomainService,
    private readonly productVerificationService: ProductVerificationDomainService,
  ) {}
  command: UpdateCategoryCommand;
  async validate(
    command: UpdateCategoryCommand,
  ): Promise<Notification<UpdateCategoryFailure>> {
    this.command = command;
    const { productIds } = this.command;

    const note = new Notification<UpdateCategoryFailure>();

    await this.categoryMustExist(note);
    productIds && productIds.length > 0 && (await this.productsMustExist(note));

    return note;
  }

  async categoryMustExist(
    note: Notification<UpdateCategoryFailure>,
  ): Promise<void> {
    const { id } = this.command;

    const exist = await this.categoryVerificationService.doesCategoryIdExist(
      id,
    );

    if (!exist) {
      note.addException(new CategoryDomainExceptions.DoesNotExist());
    }
  }

  private async productsMustExist(
    note: Notification<UpdateCategoryFailure>,
  ): Promise<void> {
    const { productIds } = this.command;

    const exist = await this.productVerificationService.doesProductIdsExist(
      productIds!,
    );

    if (!exist) {
      note.addException(new ProductDomainExceptions.DoesNotExist());
    }
  }
}
