import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  DiscountDescriptionValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';

export class CreateDiscountCommand implements CommandBase {
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.name?.validate?.(),
      this.description?.validate?.(),
      this.percentage?.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];
  }

  constructor(options: CreateDiscountCommand) {
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
  }
}
export class CreateDiscountResponseDto {
  id: string;
  name: string;
  description?: string;
  percentage: number;
  constructor(options: CreateDiscountResponseDto) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
  }
}
