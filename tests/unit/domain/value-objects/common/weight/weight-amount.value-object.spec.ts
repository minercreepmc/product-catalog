import { WeightAmountValueObject } from '@value-objects/common/weight';
import {
  ArgumentContainsNegativeException,
  ArgumentOutofBoundsException,
} from 'common-base-classes';

describe('WeightAmountValueObject', () => {
  it('should create a valid WeightAmountValueObject when the input is within the allowed range', () => {
    const weight = 100.5;
    const weightAmountVO = new WeightAmountValueObject(weight);
    expect(weightAmountVO.unpack()).toBe(weight);
  });

  it('should throw an error when the input is less than the minimum allowed value', () => {
    const weight = 0.009;
    const { isValid, exceptions } = WeightAmountValueObject.validate(weight);
    expect(isValid).toBe(false);
    expect(exceptions).toIncludeAllMembers([
      new ArgumentOutofBoundsException(),
    ]);
  });

  it('should throw an error when the input is greater than the maximum allowed value', () => {
    const weight = Number.MAX_SAFE_INTEGER + 1;
    const { isValid, exceptions } = WeightAmountValueObject.validate(weight);
    expect(isValid).toBe(false);
    expect(exceptions).toIncludeAllMembers([
      new ArgumentOutofBoundsException(),
    ]);
  });

  it('should throw an error when the input is negative', () => {
    const weight = -10;
    const { isValid, exceptions } = WeightAmountValueObject.validate(weight);
    expect(isValid).toBe(false);
    expect(exceptions).toIncludeAllMembers([
      new ArgumentContainsNegativeException(),
    ]);
  });

  it('should return true when the input is an integer', () => {
    const weight = 100;
    const { isValid } = WeightAmountValueObject.validate(weight);
    expect(isValid).toBe(true);
  });

  it('should return true when the input is a float', () => {
    const weight = 100.75;
    const { isValid } = WeightAmountValueObject.validate(weight);
    expect(isValid).toBe(true);
  });
});
