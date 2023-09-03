import { ReadOnlyDiscountRepositoryPort } from '@application/interface/discount';
import { ReadonlyRepositoryBase } from '@base/database/repositories/pg';
import { PaginationParams } from '@base/use-cases/query-handler';
import { DatabaseService } from '@config/pg';
import { Injectable } from '@nestjs/common';
import { DiscountSchema } from './discount.schema';

@Injectable()
export class ReadOnlyDiscountRepository
  extends ReadonlyRepositoryBase<DiscountSchema>
  implements ReadOnlyDiscountRepositoryPort
{
  constructor(databaseService: DatabaseService) {
    super({
      databaseService,
    });
  }
  async findOneById(id: string): Promise<DiscountSchema | null> {
    const res = await this.databaseService.runQuery(
      `
        SELECT * from discount
        WHERE id = $1 AND deleted_at is null
      `,
      [id],
    );

    return res.rows[0];
  }
  async findAll(filter: PaginationParams): Promise<DiscountSchema[] | null> {
    const { limit, offset } = filter;

    const res = await this.databaseService.runQuery(
      `
        SELECT * from discount 
        WHERE deleted_at is null
        OFFSET $1 LIMIT $2
      `,
      [offset, limit],
    );

    return res.rows;
  }
}
