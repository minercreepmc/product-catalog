import {
  TextValueObject,
  TextValueObjectOptions,
  ValidationResponse,
} from 'common-base-classes';

export enum ReviewerRoleEnums {
  Regular = 'regular',
  Admin = 'admin',
}

export const reviewerRoles = Object.values(ReviewerRoleEnums);

export class ReviewerRoleValueObject extends TextValueObject {
  constructor(value: string) {
    super(value, ReviewerRoleValueObject.OPTIONS);
  }

  isAdmin(): boolean {
    return this.unpack() === ReviewerRoleEnums.Admin;
  }

  isRegular(): boolean {
    return this.unpack() === ReviewerRoleEnums.Regular;
  }

  static validate(value: string): ValidationResponse {
    return super.validate(value, this.OPTIONS);
  }

  static createAdmin(): ReviewerRoleValueObject {
    return new ReviewerRoleValueObject(ReviewerRoleEnums.Admin);
  }

  static createRegular(): ReviewerRoleValueObject {
    return new ReviewerRoleValueObject(ReviewerRoleEnums.Regular);
  }

  private static readonly OPTIONS: TextValueObjectOptions = {
    allowedValues: reviewerRoles,
  };
}
