import { CommandMapperBase } from '@base/use-cases';
import { AddSubCategoriesCommand } from '@commands';
import { SubCategoriesAddedDomainEvent } from '@domain-events/category';
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
export class AddSubCategoriesMapper extends CommandMapperBase<AddSubCategoriesResponseDto> {
  toCommand(dto: AddSubCategoriesRequestDto): AddSubCategoriesCommand {
    const { categoryId, subIds: subCategoryIds } = dto;
    return {
      subIds: subCategoryIds.map((id) => new SubCategoryIdValueObject(id)),
      categoryId: new CategoryIdValueObject(categoryId),
    };
  }

  toResponseDto(
    event: SubCategoriesAddedDomainEvent,
  ): AddSubCategoriesResponseDto {
    const { subIds, categoryId } = event;

    return new AddSubCategoriesResponseDto({
      categoryId: categoryId.unpack(),
      subIds: subIds.map((id) => id.unpack()),
    });
  }
}
