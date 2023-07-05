import { CommandMapperBase } from '@base/use-cases';
import { AddParentCategoriesCommand } from '@commands';
import { ParentCategoryAddedDomainEvent } from '@domain-events/category';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';
import {
  AddParentCategoriesRequestDto,
  AddParentCategoriesResponseDto,
} from '../dtos';

@Injectable()
export class AddParentCategoriesMapper extends CommandMapperBase<AddParentCategoriesResponseDto> {
  toCommand(dto: AddParentCategoriesRequestDto): AddParentCategoriesCommand {
    return {
      categoryId: new CategoryIdValueObject(dto.categoryId),
      parentIds: dto.parentIds.map((id) => new ParentCategoryIdValueObject(id)),
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
