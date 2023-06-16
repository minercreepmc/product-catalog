import { UseCaseMapperBase } from '@base/use-cases';
import { AddSubCategoriesCommand } from '@commands';
import { SubCategoryAddedDomainEvent } from '@domain-events/category';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import {
  AddSubCategoriesRequestDto,
  AddSubCategoriesResponseDto,
} from '../dtos';

@Injectable()
export class AddSubCategoriesMapper extends UseCaseMapperBase<AddSubCategoriesResponseDto> {
  toCommand(dto: AddSubCategoriesRequestDto): AddSubCategoriesCommand {
    const { categoryId, subCategoryIds } = dto;
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
