import { ProductAggregate } from '@aggregates/product';
import { RepositoryBase } from '@base/database/repositories/pg';
import { DatabaseService } from '@config/pg';
import { ProductRepositoryPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';
import { ProductNameValueObject } from '@value-objects/product';
import { ID } from '@base/domain';
import { ProductSchema } from './product.schema';
import { ProductSchemaMapper } from './product.schema.mapper';

@Injectable()
export class ProductRepository
  extends RepositoryBase<ProductAggregate, ProductSchema>
  implements ProductRepositoryPort
{
  async create(entity: ProductAggregate): Promise<ProductAggregate> {
    const model = this.mapper.toPersistance(entity);

    const res = await this.databaseService.runQuery(
      `INSERT into product 
          (id, name, price, description, image_url) 
      VALUES 
          ($1, $2, $3, $4, $5)
      RETURNING *`,
      [model.id, model.name, model.price, model.description, model.image_url],
    );

    const saved = res.rows[0];

    return saved ? this.mapper.toDomain(saved) : null;
  }

  async deleteOneById(id: ID): Promise<ProductAggregate> {
    const res = await this.databaseService.runQuery(
      `
      UPDATE product SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL
    `,
      [id.value],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }

  async findOneById(id: ID): Promise<ProductAggregate> {
    const res = await this.databaseService.runQuery(
      `
      SELECT * from product WHERE id=$1 AND deleted_at IS NULL
    `,
      [id.value],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }

  async findOneByName(name: ProductNameValueObject): Promise<ProductAggregate> {
    const query = this.mapper.toQuery({
      name,
    });

    const res = await this.databaseService.runQuery(
      `SELECT * from product WHERE name=$1 AND deleted_at IS NULL`,
      [query.name],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }

  async updateOneById(
    id: ID,
    newState: ProductAggregate,
  ): Promise<ProductAggregate> {
    const model = this.mapper.toPersistance(newState);

    const res = await this.databaseService.runQuery(
      `UPDATE product 
       SET name=$2, price=$3, description=$4, image_url=$5 
        WHERE id=$1 AND deleted_at IS NULL RETURNING *`,
      [id.value, model.name, model.price, model.description, model.image_url],
    );

    const updated = res.rows[0];

    return updated ? this.mapper.toDomain(updated) : null;
  }

  constructor(databaseService: DatabaseService, mapper: ProductSchemaMapper) {
    super({
      databaseService,
      mapper,
    });
  }
}
