import { PaginateRO, PaginiateMetaRO } from '@common/ro';
import type { AddressModel } from '@v2/address/model';
import { Expose, Type } from 'class-transformer';

export class UserDataRO {
  @Expose()
  id: string;

  @Expose()
  full_name: string;

  @Expose()
  username: string;

  @Expose()
  role: string;

  @Expose()
  addresses?: AddressModel[];

  @Expose()
  phone?: string;

  @Expose()
  email?: string;
}

export class ShipperGetAllDataRO extends UserDataRO {
  @Expose()
  shipping_count: number;
}

export class ShipperGetAllRO implements PaginateRO<ShipperGetAllDataRO> {
  @Expose()
  @Type(() => ShipperGetAllDataRO)
  data: ShipperGetAllDataRO[];

  @Expose()
  meta: PaginiateMetaRO;
}
