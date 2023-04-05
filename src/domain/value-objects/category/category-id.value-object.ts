import { UUID } from 'common-base-classes';

export class CategoryIdValueObject extends UUID {
  constructor(id?: string) {
    super(id);
  }
}
