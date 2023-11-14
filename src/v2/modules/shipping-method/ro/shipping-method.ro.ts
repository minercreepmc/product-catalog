import { Expose, Type } from 'class-transformer';

export class ShippingMethodDataRO {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class ShippingMethodGetAllRO {
  @Expose()
  @Type(() => ShippingMethodDataRO)
  data: ShippingMethodDataRO[];
}
