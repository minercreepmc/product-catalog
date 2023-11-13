import { KyselyDatabase } from '@config/kysely';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingMethodRepository {
  constructor(private readonly database: KyselyDatabase) {}

  findAll() {
    return this.database
      .selectFrom('shipping_method')
      .select(['id', 'name'])
      .where('deleted_at', 'is', null)
      .execute();
  }
}
