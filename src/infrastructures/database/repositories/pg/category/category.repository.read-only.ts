import { ReadOnlyCategoryRepositoryPort } from '@application/interface/category';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { CategorySchema } from './category.schema';

@Injectable()
export class ReadOnlyCategoryRepository
  extends ReadonlyRepositoryBase<CategorySchema>
  implements ReadOnlyCategoryRepositoryPort
{
  async findOneById(id: string): Promise<CategorySchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category WHERE id = $1 and deleted_at is null
      `,
      [id],
    );

    return res.rows[0];
  }
  async findAll(filter: PaginationParams): Promise<CategorySchema[]> {
    const { limit, offset } = filter;
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category 
        WHERE deleted_at is null
        ORDER BY updated_at asc
        LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    return res.rows;
  }
  async findOneByName(name: string): Promise<CategorySchema> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id, name, description FROM category 
        WHERE name = $1 and deleted_at is null
      `,
      [name],
    );

    return res.rows[0];
  }

  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }
}
