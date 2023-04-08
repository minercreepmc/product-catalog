import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export enum ReviewerRoleEnum {
  Regular = 'regular',
  Admin = 'admin',
}

export const reviewerRoles = Object.values(ReviewerRoleEnum);

export class ReviewerRoleValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, ReviewerRoleValueObject.OPTIONS);
  }

  isAdmin(): boolean {
    return this.unpack() === ReviewerRoleEnum.Admin;
  }

  isRegular(): boolean {
    return this.unpack() === ReviewerRoleEnum.Regular;
  }

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }

  static createAdmin(): ReviewerRoleValueObject {
    return new ReviewerRoleValueObject(ReviewerRoleEnum.Admin);
  }

  static createRegular(): ReviewerRoleValueObject {
    return new ReviewerRoleValueObject(ReviewerRoleEnum.Regular);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    allowedValues: reviewerRoles,
  };
}
