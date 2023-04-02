import {
  AbstractValueObject,
  MultipleExceptions,
  ValidationExceptionBase,
  ValidationResponse,
} from 'common-base-classes';
import { WeightAmountValueObject } from './weight-amount.value-object';
import { WeightUnitValueObject } from './weight-unit.value-object';
import {
  WeightValueObjectDetails,
  CreateWeightValueObjectOptions,
} from './weight.value-object.interface';

export class WeightValueObject extends AbstractValueObject<WeightValueObjectDetails> {
  constructor(details: WeightValueObjectDetails) {
    super(details);
  }

  static create(options: CreateWeightValueObjectOptions): WeightValueObject {
    const { isValid, exceptions } = WeightValueObject.validate(options);

    if (!isValid) {
      throw new MultipleExceptions(exceptions);
    }

    return new WeightValueObject({
      amount: new WeightAmountValueObject(options.amount),
      unit: new WeightUnitValueObject(options.unit),
    });
  }

  static validate(options: CreateWeightValueObjectOptions): ValidationResponse {
    const exceptions: ValidationExceptionBase[] = [];
    if (options?.unit !== undefined) {
      const unitRes = WeightUnitValueObject.validate(options?.unit);
      if (!unitRes.isValid) {
        exceptions.push(...unitRes.exceptions);
      }
    }
    if (options?.amount !== undefined) {
      const amountRes = WeightAmountValueObject.validate(options?.amount);
      if (!amountRes.isValid) {
        exceptions.push(...amountRes.exceptions);
      }
    }
    if (exceptions.length > 0) {
      return ValidationResponse.fail(exceptions);
    } else {
      return ValidationResponse.success();
    }
  }

  get amount(): WeightAmountValueObject {
    return this.details.amount;
  }

  get unit(): WeightUnitValueObject {
    return this.details.unit;
  }
}
