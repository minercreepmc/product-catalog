import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import {
  AddSubCategoriesCommand,
  AddSubCategoriesDomainOptions,
  AddSubCategoriesResponseDto,
} from '../dtos';

@Injectable()
export class AddSubCategoriesMapper {
  toDomain(command: AddSubCategoriesCommand): AddSubCategoriesDomainOptions {
    const { categoryId, subCategoryIds } = command;
    return {
      subCategoryIds: subCategoryIds.map(
        (id) => new SubCategoryIdValueObject(id),
      ),
      categoryId: new CategoryIdValueObject(categoryId),
    };
  }

  toResponseDto(
    event: SubCategoryAddedDomainEvent,
  ): AddSubCategoriesResponseDto {
    const { subCategoryIds, categoryId } = event;

    return new AddSubCategoriesResponseDto({
      categoryId: categoryId.unpack(),
      subCategoryIds: subCategoryIds.map((id) => id.unpack()),
    });
  }
}
