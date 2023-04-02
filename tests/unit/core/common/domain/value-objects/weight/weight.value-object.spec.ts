import {
  WeightAmountValueObject,
  WeightUnitValueObject,
  WeightValueObject,
} from '@common-domain/value-objects/weight';
import { CreateWeightValueObjectOptions } from '@common-domain/value-objects/weight/weight.value-object.interface';
import {
  ArgumentContainsNegativeException,
  ArgumentDoestNotIncludeInAllowedValues,
} from 'common-base-classes';

describe('WeightValueObject', () => {
  describe('create', () => {
    it('creates a valid weight object with amount and unit', () => {
      const weight = WeightValueObject.create({
        amount: 10,
        unit: 'kg',
      });

      expect(weight.amount).toBeInstanceOf(WeightAmountValueObject);
      expect(weight.amount.unpack()).toBe(10);

      expect(weight.unit).toBeInstanceOf(WeightUnitValueObject);
      expect(weight.unit.unpack()).toBe('kg');
    });

    it('creates a valid weight object with only amount', () => {
      const weight = WeightValueObject.create({
        amount: 10,
        unit: 'kg',
      });

      expect(weight.amount).toBeInstanceOf(WeightAmountValueObject);
      expect(weight.amount.unpack()).toBe(10);

      expect(weight.unit).toBeInstanceOf(WeightUnitValueObject);
      expect(weight.unit.unpack()).toBe('kg');
    });

    it('throws an error when creating with invalid options', () => {
      expect(() =>
        WeightValueObject.create(
          {} as unknown as CreateWeightValueObjectOptions,
        ),
      ).toThrow();
    });
  });

  describe('validate', () => {
    it('returns a valid response with valid options', () => {
      const res = WeightValueObject.validate({
        amount: 10,
        unit: 'kg',
      });

      expect(res.isValid).toBe(true);
      expect(res.exceptions.length).toBe(0);
    });

    it('returns an invalid response with invalid amount', () => {
      const { isValid, exceptions } = WeightValueObject.validate({
        amount: -1,
        unit: 'kg',
      });

      expect(isValid).toBe(false);
      expect(exceptions).toIncludeAllMembers([
        new ArgumentContainsNegativeException(),
      ]);
    });

    it('returns an invalid response with invalid unit', () => {
      const { isValid, exceptions } = WeightValueObject.validate({
        amount: 10,
        unit: 'foo',
      });

      expect(isValid).toBe(false);
      expect(exceptions).toIncludeAllMembers([
        new ArgumentDoestNotIncludeInAllowedValues(),
      ]);
    });
  });
});
