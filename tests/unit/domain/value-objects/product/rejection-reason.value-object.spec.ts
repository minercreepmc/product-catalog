import { RejectionReasonValueObject } from '@value-objects/product';
import {
  ArgumentContainsEmptyStringException,
  ArgumentTooLongException,
  ArgumentTooShortException,
  ValidationResponse,
} from 'common-base-classes';

describe('RejectionReasonValueObject', () => {
  it('should create a valid RejectionReasonValueObject', () => {
    const value = 'Not suitable for our store';
    const rejectedReason = new RejectionReasonValueObject(value);
    expect(rejectedReason.unpack()).toBe(value);
  });

  it('should validate a valid reason', () => {
    const value = 'Not suitable for our store';
    const response: ValidationResponse =
      RejectionReasonValueObject.validate(value);
    expect(response.isValid).toBe(true);
  });

  it('should not validate a too short reason', () => {
    const value = 'Bad';
    const response: ValidationResponse =
      RejectionReasonValueObject.validate(value);
    expect(response.isValid).toBe(false);
    expect(response.exceptions).toIncludeAllMembers([
      new ArgumentTooShortException(),
    ]);
  });

  it('should not validate a too long reason', () => {
    const value = 'A'.repeat(101);
    const response: ValidationResponse =
      RejectionReasonValueObject.validate(value);
    expect(response.isValid).toBe(false);
    expect(response.exceptions).toIncludeAllMembers([
      new ArgumentTooLongException(),
    ]);
  });

  it('should not validate an empty reason', () => {
    const value = '';
    const response: ValidationResponse =
      RejectionReasonValueObject.validate(value);
    expect(response.isValid).toBe(false);
    expect(response.exceptions).toIncludeAllMembers([
      new ArgumentContainsEmptyStringException(),
    ]);
  });
});
