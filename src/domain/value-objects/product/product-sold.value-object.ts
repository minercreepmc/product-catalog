import { ValueObjectBase } from '@base/domain';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { IsDefined, IsNotEmpty, Min, validateSync } from 'class-validator';

export class ProductSoldValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNotEmpty()
  @Min(0)
  value: number;
  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new ProductDomainExceptions.PriceDoesNotValid();
    }
  }

  constructor(value: number) {
    this.value = value;
  }
}
