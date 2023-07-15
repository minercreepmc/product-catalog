import { CommandMapperBase } from '@base/use-cases';
import { DetachParentCategoriesCommand } from '@commands';
import { ParentCategoriesDetachedDomainEvent } from '@domain-events/category';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  ParentCategoryIdValueObject,
} from '@value-objects/category';
import {
  DetachParentCategoriesRequestDto,
  DetachParentCategoriesResponseDto,
} from '../dtos';

@Injectable()
export class DetachParentCategoriesMapper extends CommandMapperBase<DetachParentCategoriesResponseDto> {
  toCommand(
    dto: DetachParentCategoriesRequestDto,
  ): DetachParentCategoriesCommand {
    return new DetachParentCategoriesCommand({
      categoryId: new CategoryIdValueObject(dto.categoryId),
      parentIds: dto.parentIds.map((id) => new ParentCategoryIdValueObject(id)),
    });
  }
  toResponseDto(
    event: ParentCategoriesDetachedDomainEvent,
  ): DetachParentCategoriesResponseDto {
    return new DetachParentCategoriesResponseDto({
      categoryId: event.categoryId.unpack(),
      parentIds: event.parentIds.map((id) => id.unpack()),
    });
  }
}
