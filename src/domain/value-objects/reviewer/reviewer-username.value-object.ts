import { TextValueObject, ValidationResponse } from 'common-base-classes';

export class ReviewerUsernameValueObject extends TextValueObject {
  constructor(value: string) {
    super(value);
  }

  static validate(value: string): ValidationResponse {
    return super.validate(value, super.DEFAULT_OPTIONS);
  }
}
