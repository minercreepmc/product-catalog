import { DiscountAggregate } from '@aggregates/discount';
import { RepositoryBase } from '@base/database/repositories/pg';
import { DatabaseService } from '@config/pg';
import { DiscountRepositoryPort } from '@domain-interfaces';
import { Injectable } from '@nestjs/common';
import {
  DiscountIdValueObject,
  DiscountNameValueObject,
} from '@value-objects/discount';
import { DiscountSchema } from './discount.schema';
import { DiscountSchemaMapper } from './discount.schema.mapper';

@Injectable()
export class DiscountRepository
  extends RepositoryBase<DiscountAggregate, DiscountSchema>
  implements DiscountRepositoryPort
{
  constructor(mapper: DiscountSchemaMapper, databaseService: DatabaseService) {
    super({
      mapper,
      databaseService,
    });
  }
  async create(entity: DiscountAggregate): Promise<DiscountAggregate | null> {
    const { id, name, description, percentage, active } =
      this.mapper.toPersistance(entity);

    const res = await this.databaseService.runQuery(
      `INSERT into discount 
          (id, name, description, percentage, active) 
      VALUES 
          ($1, $2, $3, $4, $5)
      RETURNING *`,
      [id, name, description, percentage, active],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }
  async deleteOneById(
    id: DiscountIdValueObject,
  ): Promise<DiscountAggregate | null> {
    const domain = this.mapper.toPersistance({
      id,
    });

    const res = await this.databaseService.runQuery(
      `
      UPDATE discount SET deleted_at=now() WHERE id=$1 AND deleted_at IS NULL
      `,
      [domain.id],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }

  async deleteManyByIds(
    ids: DiscountIdValueObject[],
  ): Promise<DiscountAggregate[] | null> {
    const deleteds: DiscountAggregate[] = [];

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
    id: DiscountIdValueObject,
  ): Promise<DiscountAggregate | null> {
    const domain = this.mapper.toPersistance({
      id,
    });

    const res = await this.databaseService.runQuery(
      `
      SELECT * from discount WHERE id=$1 AND deleted_at IS NULL
      `,
      [domain.id],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }
  async updateOneById(
    id: DiscountIdValueObject,
    newState: DiscountAggregate,
  ): Promise<DiscountAggregate | null> {
    const query = this.mapper.toPersistance(newState);
    const res = await this.databaseService.runQuery(
      `UPDATE discount 
       SET name=$2, description=$3, percentage=$4, active=$5 
        WHERE id=$1 AND deleted_at IS NULL RETURNING *`,
      [query.id, query.name, query.description, query.percentage, query.active],
    );

    const updated = res.rows[0];

    return updated ? this.mapper.toDomain(updated) : null;
  }

  async findOneByName(
    name: DiscountNameValueObject,
  ): Promise<DiscountAggregate | null> {
    const query = this.mapper.toPersistance({
      name,
    });

    const res = await this.databaseService.runQuery(
      `SELECT * from discount WHERE name=$1 AND deleted_at IS NULL`,
      [query.name],
    );

    const model = res.rows[0];

    return model ? this.mapper.toDomain(model) : null;
  }
}
