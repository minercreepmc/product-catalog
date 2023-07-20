import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

export class CreateCategoryCommand {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;

  constructor(options: CreateCategoryCommand) {
    this.name = options.name;
    this.description = options.description;
  }
}

export class CreateCategoryResponseDto {
  readonly id: string;
  readonly name: string;
  readonly description?: string;

  constructor(options: CreateCategoryResponseDto) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
  }
}
