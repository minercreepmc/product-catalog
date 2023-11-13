import { Expose } from 'class-transformer';

export class ShippingMethodDataRO {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class ShippingMethodGetAllRO {
  @Expose()
  data: ShippingMethodDataRO[];
}
