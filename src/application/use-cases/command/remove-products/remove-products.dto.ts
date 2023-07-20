import { ProductIdValueObject } from '@value-objects/product';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

export class RemoveProductsCommand {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  readonly ids: ProductIdValueObject[];
  constructor(options: RemoveProductsCommand) {
    this.ids = options.ids;
  }
}

export class RemoveProductsResponseDto {
  ids: string[];

  constructor(options: RemoveProductsResponseDto) {
    this.ids = options.ids;
  }
}
