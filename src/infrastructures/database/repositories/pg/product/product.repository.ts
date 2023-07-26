import { ProductAggregate } from '@aggregates/product';
import { RepositoryBase } from '@base/database/repositories/pg';
import { DatabaseService } from '@config/pg';
import { ProductRepositoryPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';
import { ID } from '@base/domain';
import { ProductSchema } from './product.schema';
import { ProductSchemaMapper } from './product.schema.mapper';

@Injectable()
export class ProductRepository
  extends RepositoryBase<ProductAggregate, ProductSchema>
  implements ProductRepositoryPort
{
  async create(entity: ProductAggregate): Promise<ProductAggregate> {
    if (entity.categoryIds && entity.categoryIds.length > 0) {
      return this.createWithCategories(entity);
    }

    const model = this.mapper.toPersistance(entity);

    const res = await this.databaseService.runQuery(
      `INSERT into product 
          (id, name, price, description, image_url, discount_id) 
      VALUES 
          ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        model.id,
        model.name,
        model.price,
        model.description,
        model.image_url,
        model.discount_id,
      ],
    );

    const saved = res.rows[0];

    return saved ? this.mapper.toDomain(saved) : null;
  }

  private async createWithCategories(
    entity: ProductAggregate,
  ): Promise<ProductAggregate> {
    const model = this.mapper.toPersistance(entity);

    const res = await this.databaseService.runQuery(
      `
        WITH created_product AS (
          INSERT INTO product (id, name, price, description, image_url, discount_id)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        ),
        created_relationships AS (
          INSERT INTO product_category (product_id, category_id)
            SELECT created_product.id AS product_id, unnest($7::varchar[]) AS category_id
            FROM created_product
        )
        SELECT *, $7 as category_ids FROM created_product;

      `,
      [
        model.id,
        model.name,
        model.price,
        model.description,
        model.image_url,
        model.discount_id,
        model.category_ids,
      ],
    );

    const saved = res.rows[0];

    return saved ? this.mapper.toDomain(saved) : null;
  }

  async deleteOneById(id: ProductIdValueObject): Promise<ProductAggregate> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `
      UPDATE product SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL
    `,
      [query.id],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }

  async findOneById(id: ProductIdValueObject): Promise<ProductAggregate> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `
      SELECT * from product WHERE id=$1 AND deleted_at IS NULL
    `,
      [query.id],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }

  async findOneByName(name: ProductNameValueObject): Promise<ProductAggregate> {
    const query = this.mapper.toPersistance({
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
    const query = this.mapper.toPersistance({
      id,
      ...newState,
    });

    const res = await this.databaseService.runQuery(
      `UPDATE product 
       SET name=$2, price=$3, description=$4, image_url=$5, discount_id=$6
        WHERE id=$1 AND deleted_at IS NULL RETURNING *`,
      [
        query.id,
        query.name,
        query.price,
        query.description,
        query.image_url,
        query.discount_id,
      ],
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
