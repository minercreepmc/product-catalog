import { Expose } from 'class-transformer';
import { Generated } from 'kysely';
import { ShippingFeeModel } from '../model';

export class ShippingFeeGetAllDataRO implements ShippingFeeModel {
  @Expose()
  id: Generated<string>;

  @Expose()
  name: string;

  @Expose()
  fee: number;

  @Expose()
  created_at: Generated<Date>;

  @Expose()
  updated_at: Generated<Date>;

  @Expose()
  deleted_at: Generated<Date>;
}

export class ShippingFeeGetAllRO {
  @Expose()
  data: ShippingFeeGetAllDataRO[];
}

export class ShippingFeeGetOneRO extends ShippingFeeGetAllDataRO {}
export class ShippingFeeStoreRO extends ShippingFeeGetAllDataRO {}
export class ShippingFeeUpdateRO extends ShippingFeeGetAllDataRO {}
