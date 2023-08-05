import { ValidatorBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  CategoryManagementDomainService,
  CategoryVerificationDomainService,
} from '@domain-services';
import { Result } from 'oxide.ts/dist';
import {
  RemoveCategoriesCommand,
  RemoveCategoriesResponseDto,
} from './remove-categories.dto';
import { Notification } from '@base/patterns';
import { Injectable } from '@nestjs/common';

export type RemoveCategoriesSuccess = RemoveCategoriesResponseDto;
export type RemoveCategoriesFailure =
  Array<CategoryDomainExceptions.DoesNotExist>;
export type RemoveCategoriesResult = Result<
  RemoveCategoriesSuccess,
  RemoveCategoriesFailure
>;

@Injectable()
export class RemoveCategoriesValidator extends ValidatorBase<
  RemoveCategoriesCommand,
  RemoveCategoriesFailure
> {
  async validate(command: RemoveCategoriesCommand) {
    this.command = command;
    const note = new Notification<RemoveCategoriesFailure>();

    await this.categoriesMustExist(note);

    return note;
  }

  async categoriesMustExist(note: Notification<RemoveCategoriesFailure>) {
    const isExist = await this.categoryVerificationService.doesCategoryIdsExist(
      this.command.ids,
    );
    if (!isExist) {
      note.addException(new CategoryDomainExceptions.DoesNotExist());
    }
  }

  command: RemoveCategoriesCommand;
  constructor(
    private readonly categoryVerificationService: CategoryVerificationDomainService,
  ) {
    super();
  }
}
