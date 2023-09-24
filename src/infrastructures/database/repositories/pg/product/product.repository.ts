import { ProductAggregate } from '@aggregates/product';
import { RepositoryBase } from '@base/database/repositories/pg';
import { DatabaseService } from '@config/pg';
import { ProductRepositoryPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';
import { ProductSchema } from './product.schema';
import { ProductSchemaMapper } from './product.schema.mapper';

@Injectable()
export class ProductRepository
  extends RepositoryBase<ProductAggregate, ProductSchema>
  implements ProductRepositoryPort
{
  constructor(databaseService: DatabaseService, mapper: ProductSchemaMapper) {
    super({
      databaseService,
      mapper,
    });
  }
  async create(entity: ProductAggregate): Promise<ProductAggregate | null> {
    const model = this.mapper.toPersistance(entity);

    const res = await this.databaseService.runQuery(
      `INSERT into product 
          (id, name, price, description, image_url, discount_id, sold) 
      VALUES 
          ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        model.id,
        model.name,
        model.price,
        model.description,
        model.image_url,
        model.discount_id,
        model.sold,
      ],
    );

    if (entity.categoryIds && entity.categoryIds.length > 0) {
      model.category_ids = await this.updateCategoryIds(model);
    }

    const saved = res.rows[0];
    return saved ? this.mapper.toDomain(saved) : null;
  }

  private async updateCategoryIds(entity: Partial<ProductSchema>) {
    if (!entity.category_ids || entity.category_ids.length === 0) {
      const res = await this.databaseService.runQuery(
        `
          DELETE 
          FROM product_category
          WHERE product_id = $1
          AND category_id NOT IN (SELECT unnest($2::varchar[]))
          RETURNING category_id as category_ids
        `,
        [entity.id, entity.category_ids],
      );
      return res.rows[0]?.category_ids;
    }

    const res = await this.databaseService.runQuery(
      `
          INSERT INTO product_category (product_id, category_id)
          SELECT $1, unnest($2::varchar[]) AS category_ids
          RETURNING category_id as category_ids

      `,
      [entity.id, entity.category_ids],
    );

    return res.rows[0]?.category_ids;
  }

  async deleteOneById(
    id: ProductIdValueObject,
  ): Promise<ProductAggregate | null> {
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

  async deleteManyByIds(
    ids: ProductIdValueObject[],
  ): Promise<ProductAggregate[] | null> {
    const deleteds: ProductAggregate[] = [];

    for (const id of ids) {
      const deleted = await this.deleteOneById(id);
      if (deleted) {
        deleteds.push(deleted);
      } else {
        break;
      }
    }

    return deleteds ? deleteds : [];
  }

  async findOneById(
    id: ProductIdValueObject,
  ): Promise<ProductAggregate | null> {
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

  async findOneByName(
    name: ProductNameValueObject,
  ): Promise<ProductAggregate | null> {
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
    id: ProductIdValueObject,
    newState: ProductAggregate,
  ): Promise<ProductAggregate | null> {
    const query = this.mapper.toPersistance(newState);

    const res = await this.databaseService.runQuery(
      `UPDATE product 
       SET name=$2, price=$3, description=$4, image_url=$5, discount_id=$6, sold=$7
        WHERE id=$1 AND deleted_at IS NULL RETURNING *`,
      [
        query.id,
        query.name,
        query.price,
        query.description,
        query.image_url,
        query.discount_id,
        query.sold,
      ],
    );

    const updated = res.rows[0];

    if (query.category_ids && query.category_ids.length >= 0) {
      updated.category_ids = await this.updateCategoryIds(query);
    }

    if (query.discount_id) {
      updated.discount_id = await this.updateDiscount(query);
    }

    return updated ? this.mapper.toDomain(updated) : null;
  }

  private async updateDiscount(query: Partial<ProductSchema>) {
    console.log(query);
    if (query.discount_id) {
      const res = await this.databaseService.runQuery(
        `
        UPDATE product 
        SET discount_id=$1
        WHERE id=$2
        RETURNING discount_id;
      `,
        [query.discount_id, query.id],
      );
      return res.rows[0].discount_id;
    } else {
      const res = await this.databaseService.runQuery(
        `
          UPDATE product
          SET discount_id=null
          WHERE id=$1
          RETURNING discount_id;
        `,
        [query.id],
      );
      console.log(res.rows[0]);
      return res.rows[0].discount_id;
    }
  }

  async findOneOrFail(id: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT * FROM product WHERE id=$1;
      `,
      [id],
    );

    const product = res.rows[0];

    if (product) {
      throw new Error('Product not found');
    }

    return product;
  }
}
