import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  CategoryDescriptionValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';

export class CreateCategoryCommand implements CommandBase {
  name: CategoryNameValueObject;
  description?: CategoryDescriptionValueObject;

  validate?(): DomainExceptionBase[] {
    return [this.name?.validate(), this.description?.validate()].filter(
      (e) => e,
    ) as DomainExceptionBase[];
  }

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
