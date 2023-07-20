import { CategoryIdValueObject } from '@value-objects/category';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

export class RemoveCategoriesCommand {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  readonly ids: CategoryIdValueObject[];
  constructor(options: RemoveCategoriesCommand) {
    this.ids = options.ids;
  }
}

export class RemoveCategoriesResponseDto {
  readonly ids: string[];

  constructor(options: RemoveCategoriesResponseDto) {
    this.ids = options.ids;
  }
}
