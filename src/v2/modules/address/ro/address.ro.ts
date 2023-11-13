import { Expose, Type } from 'class-transformer';
import { Generated } from 'kysely';
import { AddressModel } from '../model';

export class GetAllAddressDataRO implements AddressModel {
  @Expose()
  id: Generated<string>;

  @Expose()
  location: string;

  @Expose()
  user_id: string;

  @Expose()
  created_at: Generated<Date>;

  @Expose()
  updated_at: Generated<Date>;

  @Expose()
  deleted_at: Generated<Date>;
}

export class AddressGetAllRO {
  @Expose()
  @Type(() => GetAllAddressDataRO)
  data: GetAllAddressDataRO[];
}

export class AddressCreateRO implements AddressModel {
  @Expose()
  id: Generated<string>;

  @Expose()
  location: string;

  @Expose()
  user_id: string;

  @Expose()
  created_at: Generated<Date>;

  @Expose()
  updated_at: Generated<Date>;

  @Expose()
  deleted_at: Generated<Date>;
}

export class AddressUpdateRO implements AddressModel {
  @Expose()
  id: Generated<string>;

  @Expose()
  location: string;

  @Expose()
  user_id: string;

  @Expose()
  created_at: Generated<Date>;

  @Expose()
  updated_at: Generated<Date>;

  @Expose()
  deleted_at: Generated<Date>;
}
