import type { CategoryAggregate } from '@aggregates/category';
import { RepositoryBase } from '@base/database/repositories/pg';
import { DatabaseService } from '@config/pg';
import { CategoryRepositoryPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';
import {
  CategoryIdValueObject,
  CategoryNameValueObject,
} from '@value-objects/category';
import { CategorySchema } from './category.schema';
import { CategorySchemaMapper } from './category.schema.mapper';

@Injectable()
export class CategoryRepository
  extends RepositoryBase<CategoryAggregate, CategorySchema>
  implements CategoryRepositoryPort
{
  async create(entity: CategoryAggregate): Promise<CategoryAggregate> {
    const model = this.mapper.toPersistance(entity);

    const res = await this.databaseService.runQuery(
      `INSERT into category
          (id, name, description)
      VALUES
          ($1, $2, $3)
      RETURNING *`,
      [model.id, model.name, model.description],
    );

    const saved = res.rows[0];

    return saved ? this.mapper.toDomain(saved) : null;
  }
  async deleteOneById(id: CategoryIdValueObject): Promise<CategoryAggregate> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `DELETE FROM category WHERE id=$1 RETURNING *`,
      [query.id],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }

  async findOneById(id: CategoryIdValueObject): Promise<CategoryAggregate> {
    const query = this.mapper.toPersistance({ id });

    const res = await this.databaseService.runQuery(
      `SELECT * from category WHERE id=$1`,
      [query.id],
    );

    const deleted = res.rows[0];

    return deleted ? this.mapper.toDomain(deleted) : null;
  }

  async updateOneById(
    id: CategoryIdValueObject,
    newState: CategoryAggregate,
  ): Promise<CategoryAggregate> {
    const query = this.mapper.toPersistance({ id });
    const model = this.mapper.toPersistance(newState);

    const res = await this.databaseService.runQuery(
      `UPDATE category 
      SET name=$2, description=$3
      WHERE id=$1
      RETURNING *`,
      [query.id, model.name, model.description],
    );

    const saved = res.rows[0];

    return saved ? this.mapper.toDomain(saved) : null;
  }

  async findOneByName(
    name: CategoryNameValueObject,
  ): Promise<CategoryAggregate> {
    const query = this.mapper.toPersistance({ name });

    const res = await this.databaseService.runQuery(
      `SELECT * from category WHERE name=$1`,
      [query.name],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }

  constructor(databaseService: DatabaseService, mapper: CategorySchemaMapper) {
    super({
      databaseService,
      mapper,
    });
  }
}
