import type { AddressModel } from '@v2/address/model';

export class UserRO {
  id: string;
  full_name: string;
  username: string;
  role: string;
  addresses: AddressModel[];
}
