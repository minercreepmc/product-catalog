import type { AddressModel } from '@v2/address/model';

export class LoginResponseRO {
  cookie: string;
}

export class ProfileRO {
  username: string;
  full_name: string;
  addresses: AddressModel[];
}
