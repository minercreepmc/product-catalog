import { KyselyDatabase } from '@config/kysely';
import { Injectable } from '@nestjs/common';
import type { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressRepository {
  constructor(private readonly database: KyselyDatabase) {}

  store(userId: string, dto: CreateAddressDto) {
    const { location } = dto;
    return this.database
      .insertInto('address')
      .values({
        location,
        user_id: userId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  delete(id: string) {
    return this.database
      .updateTable('address')
      .set({ deleted_at: new Date() })
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  getAll(userId: string) {
    return this.database
      .selectFrom('address')
      .selectAll()
      .where('user_id', '=', userId)
      .where('deleted_at', 'is', null)
      .execute();
  }

  findOne(id: string) {
    return this.database
      .selectFrom('address')
      .selectAll()
      .where('id', '=', id)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();
  }

  findByLocation(location: string) {
    return this.database
      .selectFrom('address')
      .selectAll()
      .where('location', '=', location)
      .where('deleted_at', 'is', null)
      .executeTakeFirst();
  }

  update(id: string, dto: UpdateAddressDto) {
    return this.database
      .updateTable('address')
      .set(dto)
      .where('id', '=', id)
      .where('deleted_at', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getAddressLocation(id: string) {
    const res = await this.database
      .selectFrom('address')
      .select('location')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return res?.location;
  }
}
