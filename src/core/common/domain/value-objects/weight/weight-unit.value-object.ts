import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';
import { allowedWeightUnits } from './allowed-weight-units';

export class WeightUnitValueObject extends TextValueObject {
  constructor(value: string) {
    super(value);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    minLength: 1,
    maxLength: 4,
    allowEmpty: false,
    allowNumber: false,
    allowSymbols: true,
    allowLowercase: true,
    allowUppercase: true,
    allowWhitespace: false,
    allowedValues: allowedWeightUnits,
  };

  static validate(value: string): ValidationResponse {
    return super.validate(value, WeightUnitValueObject.OPTIONS);
  }
}
