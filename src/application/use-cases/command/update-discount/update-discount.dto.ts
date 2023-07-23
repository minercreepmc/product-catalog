import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  DiscountActiveValueObject,
  DiscountDescriptionValueObject,
  DiscountIdValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';

export class UpdateDiscountCommand implements CommandBase {
  constructor(options: UpdateDiscountCommand) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
    this.active = options.active;
  }
  id: DiscountIdValueObject;
  name?: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage?: DiscountPercentageValueObject;
  active?: DiscountActiveValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.id.validate(),
      this.name?.validate(),
      this.description?.validate(),
      this.percentage?.validate(),
      this.active?.validate(),
    ].filter((e) => e);
  }
}

export class UpdateDiscountResponseDto {
  id: string;
  name?: string;
  description?: string;
  percentage?: number;
  active?: boolean;

  constructor(options: UpdateDiscountResponseDto) {
    this.id = options.id;
    this.name = options.name;
    this.description = options.description;
    this.percentage = options.percentage;
    this.active = options.active;
  }
}
