import { EntityBase, ID } from '@base/domain';

export class UserAddressEntity implements EntityBase {
  id: ID;
  location: string;

  constructor(id: ID, location: string) {
    this.id = id;
    this.location = location;
  }
}
