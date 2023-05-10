import { CategoryCreatedDomainEvent } from '@domain-events/category/category-created.domain-event';
import { Injectable } from '@nestjs/common';
import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
  ParentCategoryIdValueObject,
  SubCategoryIdValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';
import {
  CreateCategoryCommand,
  CreateCategoryDomainOptions,
  CreateCategoryResponseDto,
} from '../dtos';

@Injectable()
export class CreateCategoryMapper {
  toDomain(command: CreateCategoryCommand): CreateCategoryDomainOptions {
    let description: CategoryDescriptionValueObject;
    let parentIds: ParentCategoryIdValueObject[];
    let subCategoryIds: SubCategoryIdValueObject[];
    let productIds: ProductIdValueObject[];
    if (command.description) {
      description = new CategoryDescriptionValueObject(command.description);
    }

    if (command.parentIds && command.parentIds.length > 0) {
      parentIds = command.parentIds.map(
        (id) => new ParentCategoryIdValueObject(id),
      );
    }

    if (command.subCategoryIds && command.subCategoryIds.length > 0) {
      subCategoryIds = command.subCategoryIds.map(
        (id) => new SubCategoryIdValueObject(id),
      );
    }

    if (command.productIds && command.productIds.length > 0) {
      productIds = command.productIds.map((id) => new ProductIdValueObject(id));
    }

    return {
      name: new CategoryNameValueObject(command.name),
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
