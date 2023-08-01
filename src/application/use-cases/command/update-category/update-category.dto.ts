import { CommandBase } from '@base/use-cases';
import {
  CategoryDescriptionValueObject,
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { ProductIdValueObject } from '@value-objects/product';

export class UpdateCategoryCommand implements CommandBase {
  id: CategoryIdValueObject;
  name?: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;
  productIds?: ProductIdValueObject[];

  validate?() {
    return [
      this.id.validate(),
      this.name?.validate(),
      this.description?.validate(),
      this.productIds?.map?.((p) => p?.validate())[0],
    ].filter((e) => e);
  }

  constructor(options: UpdateCategoryCommand) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.productIds = options.productIds;
  }
}

export class UpdateCategoryResponseDto {
  id: string;
  name?: string;
  description?: string;
  productIds?: string[];

  constructor(dto: UpdateCategoryResponseDto) {
    this.id = dto.id;
    this.name = dto.name;
    this.description = dto.description;
    this.productIds = dto.productIds;
  }
}
