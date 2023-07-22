import { DomainExceptionBase } from '@base/domain';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductIdValueObject } from '@value-objects/product';
import { ArrayMinSize, IsArray, validateSync } from 'class-validator';

export class RemoveProductsCommand {
  @IsArray()
  @ArrayMinSize(1)
  readonly ids: ProductIdValueObject[];

  validate?(): DomainExceptionBase[] {
    let isValid: boolean;
    if (validateSync(this).length > 0) {
      isValid = false;
    }

    let exception: DomainExceptionBase;

    isValid = !this.ids.some((id) => {
      exception = id.validate();
      if (exception) return true;
      return false;
    });

    if (!isValid) {
      return [new ProductDomainExceptions.IdDoesNotValid()];
    } else {
      return [];
    }
  }

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
