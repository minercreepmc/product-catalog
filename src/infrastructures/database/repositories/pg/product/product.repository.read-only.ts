import { ReadonlyProductRepositoryPort } from '@application@/interface/product';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { ProductSchema } from './product.schema';

@Injectable()
export class ReadOnlyProductRepository
  extends ReadonlyRepositoryBase<ProductSchema>
  implements ReadonlyProductRepositoryPort
{
  async findOneById(id: string): Promise<ProductSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url from product WHERE id=$1 and deleted_at is null
      `,
      [id],
    );

    return res.rows[0];
  }

  async findOneByName(name: string): Promise<ProductSchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, price, description, image_url from product WHERE name=$1 and deleted_at is null
      `,
      [name],
    );

    return res.rows[0];
  }

  async findAll(filter: PaginationParams): Promise<ProductSchema[]> {
    const { limit, offset } = filter;

    const res = await this.databaseService.runQuery(
      ` 
        SELECT id, name, price, description, image_url from product 
        WHERE deleted_at is null
        ORDER BY updated_at ASC
        OFFSET $1 LIMIT $2;
      `,
      [offset, limit],
    );

    return res.rows;
  }

  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }
}
