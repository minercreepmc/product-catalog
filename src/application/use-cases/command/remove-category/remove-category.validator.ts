import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryVerificationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { RemoveCategoryCommand } from './remove-category.dto';
import { RemoveCategoryFailure } from './remove-category.result';

@Injectable()
export class RemoveCategoryValidator extends ValidatorBase<
  RemoveCategoryCommand,
  RemoveCategoryFailure
> {
  constructor(
    private readonly categoryVerificationService: CategoryVerificationDomainService,
  ) {
    super();
  }
  command: RemoveCategoryCommand;
  async validate(
    command: RemoveCategoryCommand,
  ): Promise<Notification<RemoveCategoryFailure>> {
    this.command = command;

    const note = new Notification<RemoveCategoryFailure>();

    await this.validateCategoryMustExist(note);

    return note;
  }

  async validateCategoryMustExist(note: Notification<RemoveCategoryFailure>) {
    const exist = await this.categoryVerificationService.doesCategoryIdExist(
      this.command.id,
    );

    if (!exist) {
      note.addException(new CategoryDomainExceptions.DoesNotExist());
    }
  }
}
