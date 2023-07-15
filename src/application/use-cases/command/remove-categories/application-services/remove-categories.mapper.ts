import { CommandMapperBase } from '@base/use-cases';
import { RemoveCategoriesCommand } from '@commands';
import { CategoryRemovedDomainEvent } from '@domain-events/category';
import { Injectable } from '@nestjs/common';
import { CategoryIdValueObject } from '@value-objects/category';
import {
  RemoveCategoriesRequestDto,
  RemoveCategoriesResponseDto,
} from '../dtos/remove-category.dto';

@Injectable()
export class RemoveCategoriesMapper extends CommandMapperBase<RemoveCategoriesResponseDto> {
  toCommand(dto: RemoveCategoriesRequestDto): RemoveCategoriesCommand {
    return new RemoveCategoriesCommand({
      ids: dto.ids.map((id) => new CategoryIdValueObject(id)),
    });
  }
  toResponseDto(
    events: CategoryRemovedDomainEvent[],
  ): RemoveCategoriesResponseDto {
    const ids = events.map((event) => event.categoryId.unpack());
    const parentIds = events.reduce(
      (allIds, event) =>
        allIds.concat(event.parentIds.map((id) => id.unpack())),
      [],
    );
    const subIds = events.reduce(
      (allIds, event) => allIds.concat(event.subIds.map((id) => id.unpack())),
      [],
    );

    return new RemoveCategoriesResponseDto({
      ids,
      parentIds,
      subIds,
    });
  }
}
