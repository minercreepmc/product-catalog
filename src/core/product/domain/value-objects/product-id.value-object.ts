import { UUID } from 'common-base-classes';

export class ProductIdValueObject extends UUID {
  constructor(value?: string) {
    super(value);
  }
}
