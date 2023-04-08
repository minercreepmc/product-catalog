import {
  ReviewerRoleEnums,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { ValidationResponse } from 'common-base-classes';

describe('ReviewerRoleValueObject', () => {
  it('should create a reviewer role value object successfully if it is valid', () => {
    const role = ReviewerRoleEnums.Admin;
    const reviewerRole = new ReviewerRoleValueObject(role);
    expect(reviewerRole.unpack()).toBe(role);
  });

  it('should throw a validation exception if the value is not allowed', () => {
    const role = 'superuser';
    expect(() => new ReviewerRoleValueObject(role)).toThrow();
  });

  it('should validate a valid value successfully', () => {
    const role = ReviewerRoleEnums.Admin;
    const response: ValidationResponse = ReviewerRoleValueObject.validate(role);
    expect(response.isValid).toBe(true);
  });

  it('should invalidate an invalid value successfully', () => {
    const role = 'superuser';
    const response: ValidationResponse = ReviewerRoleValueObject.validate(role);
    expect(response.isValid).toBe(false);
    expect(response.exceptions).toHaveLength(1);
  });
});
