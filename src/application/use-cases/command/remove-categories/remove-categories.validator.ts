import { ValidatorBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Result } from 'oxide.ts/dist';
import {
  RemoveCategoriesCommand,
  RemoveCategoriesResponseDto,
} from './remove-categories.dto';
import { Notification } from '@base/patterns';
import { Injectable } from '@nestjs/common';

export type RemoveCategoriesProcessSuccess = RemoveCategoriesResponseDto;
export type RemoveCategoriesProcessFailure =
  Array<CategoryDomainExceptions.DoesNotExist>;
export type RemoveCategoriesResult = Result<
  RemoveCategoriesProcessSuccess,
  RemoveCategoriesProcessFailure
>;

@Injectable()
export class RemoveCategoriesValidator
  implements
    ValidatorBase<RemoveCategoriesCommand, RemoveCategoriesProcessFailure>
{
  async validate(command: RemoveCategoriesCommand) {
    this.command = command;
    const note = new Notification<RemoveCategoriesProcessFailure>();

    await this.categoriesMustExist(note);

    return note;
  }

  async categoriesMustExist(
    note: Notification<RemoveCategoriesProcessFailure>,
  ) {
    for (const id of this.command.ids) {
      const isExist =
        await this.categoryManagementService.doesCategoryExistById(id);

      if (!isExist) {
        note.addException(new CategoryDomainExceptions.DoesNotExist());
      }
    }
  }

  private command: RemoveCategoriesCommand;
  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {}
}
