import { UUID } from 'common-base-classes';

export class ReviewerIdValueObject extends UUID {
  constructor(value?: string) {
    super(value);
  }
}
