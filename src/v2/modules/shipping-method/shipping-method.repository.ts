import type { DatabaseService } from '@config/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingMethodRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    const res = await this.databaseService.runQuery(`
      SELECT id, name FROM shipping_method;
      `);

    return res.rows;
  }
}
