import { SizeValueObject } from '@value-objects/common';
import {
  ArgumentContainsEmptyStringException,
  ArgumentTooLongException,
} from 'common-base-classes';

describe('SizeValueObject', () => {
  it('should create a valid SizeValueObject', () => {
    const sizeValue = '6.7';
    const size = new SizeValueObject(sizeValue);
    expect(size.unpack()).toBe(sizeValue);
  });

  it('should fail to create a SizeValueObject with an empty string', () => {
    const invalidSizeValue = '';
    expect(() => new SizeValueObject(invalidSizeValue)).toThrow();
  });

  it('should fail to create a SizeValueObject with a string longer than 50 characters', () => {
    const invalidSizeValue = 'a'.repeat(51);
    expect(() => new SizeValueObject(invalidSizeValue)).toThrow();
  });

  it('should return true when validating a valid size value', () => {
    const validSizeValue = '32 inches';
    const { isValid } = SizeValueObject.validate(validSizeValue);
    expect(isValid).toBe(true);
  });

  it('should return false when validating an empty string', () => {
    const invalidSizeValue = '';
    const { isValid, exceptions } = SizeValueObject.validate(invalidSizeValue);
    expect(isValid).toBe(false);
    expect(exceptions).toIncludeAllMembers([
      new ArgumentContainsEmptyStringException(),
    ]);
  });

  it('should return false when validating a string longer than 50 characters', () => {
    const invalidSizeValue = 'a'.repeat(51);
    const { isValid, exceptions } = SizeValueObject.validate(invalidSizeValue);
    expect(isValid).toBe(false);
    expect(exceptions).toIncludeAllMembers([new ArgumentTooLongException()]);
  });
});
