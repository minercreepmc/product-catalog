import {
  allowedWeightUnits,
  WeightUnitValueObject,
} from '@common-domain/value-objects/weight';

describe('WeightUnitValueObject', () => {
  it('should create a valid WeightUnitValueObject for each allowed unit', () => {
    allowedWeightUnits.forEach((unit) => {
      expect(() => new WeightUnitValueObject(unit)).not.toThrow();
    });
  });

  it('should not create a WeightUnitValueObject for an invalid unit', () => {
    const invalidUnit = 'INVALID_UNIT';
    expect(() => new WeightUnitValueObject(invalidUnit)).toThrow();
  });

  it('should return true for valid units when calling validate', () => {
    allowedWeightUnits.forEach((unit) => {
      const { isValid } = WeightUnitValueObject.validate(unit);
      expect(isValid).toBe(true);
    });
  });

  it('should return false for invalid units when calling validate', () => {
    const invalidUnit = 'INVALID_UNIT';
    const { isValid } = WeightUnitValueObject.validate(invalidUnit);
    expect(isValid).toBe(false);
  });
});
