import { CommandMapperBase } from '@base/use-cases';
import { CreateCategoryCommand } from '@commands';
import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { Injectable } from '@nestjs/common';
import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import { CreateCategoryRequestDto, CreateCategoryResponseDto } from '../dtos';

@Injectable()
export class CreateCategoryMapper extends CommandMapperBase<CreateCategoryResponseDto> {
  toCommand(dto: CreateCategoryRequestDto): CreateCategoryCommand {
    let description: CategoryDescriptionValueObject;
    let parentIds: ParentCategoryIdValueObject[];
    let subCategoryIds: SubCategoryIdValueObject[];
    let productIds: ProductIdValueObject[];
    if (dto.description) {
      description = new CategoryDescriptionValueObject(dto.description);
    }

    if (dto.parentIds && dto.parentIds.length > 0) {
      parentIds = dto.parentIds.map(
        (id) => new ParentCategoryIdValueObject(id),
      );
    }

    if (dto.subCategoryIds && dto.subCategoryIds.length > 0) {
      subCategoryIds = dto.subCategoryIds.map(
        (id) => new SubCategoryIdValueObject(id),
      );
    }

    if (dto.productIds && dto.productIds.length > 0) {
      productIds = dto.productIds.map((id) => new ProductIdValueObject(id));
    }

    return {
      name: new CategoryNameValueObject(dto.name),
      description,
      parentIds,
      subCategoryIds,
      productIds,
    };
  }

  toResponseDto(event: CategoryCreatedDomainEvent): CreateCategoryResponseDto {
    let description: string;
    let parentIds: string[];
    let subCategoryIds: string[];
    let productIds: string[];
    if (event.description) {
      description = event.description.unpack();
    }

    if (event.subCategoryIds && event.subCategoryIds.length > 0) {
      subCategoryIds = event.subCategoryIds.map((id) => id.unpack());
    }

    if (event.parentIds && event.parentIds.length > 0) {
      parentIds = event.parentIds.map((id) => id.unpack());
    }

    if (event.productIds && event.productIds.length > 0) {
      productIds = event.productIds.map((id) => id.unpack());
    }

    return new CreateCategoryResponseDto({
      id: event.entityId.unpack(),
      name: event.name.unpack(),
      description,
      parentIds,
      subCategoryIds,
      productIds,
    });
  }
}
