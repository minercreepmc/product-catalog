import { ID } from '@base/domain';

export class UserIdValueObject extends ID {
  constructor(value?: string) {
    super(value);
  }
}
