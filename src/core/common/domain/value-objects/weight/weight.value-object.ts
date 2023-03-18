import { AbstractValueObject } from 'common-base-classes';
import { WeightAmountValueObject } from './weight-amount.value-object';
import { WeightUnitValueObject } from './weight-unit.value-object';
import {
  WeightValueObjectDetails,
  WeightValueObjectOptions,
} from './weight.value-object.interface';

export class WeightValueObject extends AbstractValueObject<WeightValueObjectDetails> {
  constructor(details: WeightValueObjectDetails) {
    super(details);
  }

  static create(options: WeightValueObjectOptions): WeightValueObject {
    return new WeightValueObject({
      amount: new WeightAmountValueObject(options.amount),
      unit: new WeightUnitValueObject(options.unit),
    });
  }

  get amount(): WeightAmountValueObject {
    return this.details.amount;
  }

  get unit(): WeightUnitValueObject {
    return this.details.unit;
  }
}
