import { ParentCategoryAddedDomainEvent } from '@domain-events/category';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';
import {
  AddParentCategoriesCommand,
  AddParentCategoriesDomainOptions,
  AddParentCategoriesResponseDto,
} from '../dtos';

@Injectable()
export class AddParentCategoriesMapper {
  toDomain(
    command: AddParentCategoriesCommand,
  ): AddParentCategoriesDomainOptions {
    return {
      categoryId: new CategoryIdValueObject(command.categoryId),
      parentIds: command.parentIds.map(
        (id) => new ParentCategoryIdValueObject(id),
      ),
    };
  }

  toResponseDto(
    event: ParentCategoryAddedDomainEvent,
  ): AddParentCategoriesResponseDto {
    return new AddParentCategoriesResponseDto({
      parentIds: event.parentIds.map((id) => id.unpack()),
      categoryId: event.categoryId.unpack(),
    });
  }
}
