import { Expose } from 'class-transformer';

export class ShippingMethodGetAllRO {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
