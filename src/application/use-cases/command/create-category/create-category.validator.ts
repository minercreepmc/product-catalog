import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { CategoryManagementDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { Result } from 'oxide.ts';
import {
  CreateCategoryCommand,
  CreateCategoryResponseDto,
} from './create-category.dto';

export type CreateCategorySuccess = CreateCategoryResponseDto;
export type CreateCategoryFailure =
  Array<CategoryDomainExceptions.AlreadyExist>;
export type CreateCategoryResult = Result<
  CreateCategorySuccess,
  CreateCategoryFailure
>;

@Injectable()
export class CreateCategoryValidator extends ValidatorBase<
  CreateCategoryCommand,
  CreateCategoryFailure
> {
  async validate(command: CreateCategoryCommand) {
    this.command = command;

    const note = new Notification<CreateCategoryFailure>();

    await this.nameMustBeUnique(note);

    return note;
  }

  private async nameMustBeUnique(
    note: Notification<CreateCategoryFailure>,
  ): Promise<void> {
    const isExist =
      await this.categoryManagementService.doesCategoryExistByName(
        this.command.name,
      );

    if (isExist) {
      note.addException(new CategoryDomainExceptions.AlreadyExist());
    }
  }

  command: CreateCategoryCommand;
  constructor(
    private readonly categoryManagementService: CategoryManagementDomainService,
  ) {
    super();
  }
}
