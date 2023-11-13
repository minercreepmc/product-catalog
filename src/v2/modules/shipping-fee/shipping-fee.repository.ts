import { Injectable } from '@nestjs/common';
import { CreateShippingFeeDto } from './dto';
import { KyselyDatabase } from '@config/kysely';

@Injectable()
export class ShippingFeeRepository {
  constructor(private readonly database: KyselyDatabase) {}

  store(dto: CreateShippingFeeDto) {
    const { name, fee } = dto;
    return this.database
      .insertInto('shipping_fee')
      .values({
        name,
        fee,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  update(id: string, dto: CreateShippingFeeDto) {
    const { name, fee } = dto;
    let query = this.database
      .updateTable('shipping_fee')
      .where('id', '=', id)
      .where('deleted_at', 'is', null)
      .returningAll();

    if (name) {
      query = query.set({ name });
    }

    if (fee) {
      query = query.set({ fee });
    }

    return query.executeTakeFirstOrThrow();
  }

  delete(id: string) {
    return this.database
      .updateTable('shipping_fee')
      .set({ deleted_at: new Date() })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  findAll() {
    return this.database
      .selectFrom('shipping_fee')
      .selectAll()
      .where('deleted_at', 'is', null)
      .execute();
  }

  findOne(id: string) {
    return this.database
      .selectFrom('shipping_fee')
      .selectAll()
      .where('id', '=', id)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();
  }

  findOneByName(name: string) {
    return this.database
      .selectFrom('shipping_fee')
      .selectAll()
      .where('name', '=', name)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();
  }
}
