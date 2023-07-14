import { CommandMapperBase } from '@base/use-cases';
import { DetachSubCategoriesCommand } from '@commands';
import { SubCategoriesDetachedDomainEvent } from '@domain-events/category';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import {
  DetachSubCategoriesRequestDto,
  DetachSubCategoriesResponseDto,
} from '../dtos/detach-sub-categories.dto';

@Injectable()
export class DetachSubCategoriesMapper extends CommandMapperBase<DetachSubCategoriesResponseDto> {
  toCommand(dto: DetachSubCategoriesRequestDto): DetachSubCategoriesCommand {
    const { categoryId, subIds: subCategoryIds } = dto;
    return new DetachSubCategoriesCommand({
      categoryId: new CategoryIdValueObject(categoryId),
      subCategoryIds: subCategoryIds.map(
        (id) => new SubCategoryIdValueObject(id),
      ),
    });
  }
  toResponseDto(
    event: SubCategoriesDetachedDomainEvent,
  ): DetachSubCategoriesResponseDto {
    const { subCategoryIds, categoryId } = event;
    return new DetachSubCategoriesResponseDto({
      categoryId: categoryId.unpack(),
      subIds: subCategoryIds.map((id) => id.unpack()),
    });
  }
}
