import {
  DimensionUnitValueObject,
  allowedDimensionUnits,
} from '@value-objects/common/dimension';

describe('DimensionUnitValueObject', () => {
  it('should create a valid DimensionUnitValueObject for each allowed unit', () => {
    allowedDimensionUnits.forEach((unit) => {
      const dimensionUnitValueObject = new DimensionUnitValueObject(unit);
      expect(dimensionUnitValueObject).toBeInstanceOf(DimensionUnitValueObject);
    });
  });

  it('should throw an error when creating a DimensionUnitValueObject with an invalid unit', () => {
    expect(() => new DimensionUnitValueObject('INVALID')).toThrow();
  });

  it('should validate a valid unit', () => {
    const validUnit = 'cm';
    const validationResult = DimensionUnitValueObject.validate(validUnit);
    expect(validationResult.isValid).toBe(true);
  });

  it('should not validate an invalid unit', () => {
    const invalidUnit = 'INVALID';
    const validationResult = DimensionUnitValueObject.validate(invalidUnit);
    expect(validationResult.isValid).toBe(false);
  });
});
