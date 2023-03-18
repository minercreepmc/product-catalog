import { TextValueObject, TextValueObjectOptions } from 'common-base-classes';
import { allowedDimensionUnits } from './allowed-dimension-unit';

export class DimensionUnitValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, DimensionUnitValueObject.OPTIONS);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    allowedValues: allowedDimensionUnits,
    allowNumber: false,
    allowSymbols: true,
    allowUppercase: true,
    allowLowercase: true,
    allowWhitespace: true,
    allowEmpty: false,
    minLength: 1,
    maxLength: 20,
  };

  static validate(value: string) {
    return super.validate(value, DimensionUnitValueObject.OPTIONS);
  }
}
