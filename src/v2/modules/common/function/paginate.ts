import { SelectQueryBuilder } from 'kysely';
import { PaginationConfig } from '@common/dto';
import { KyselyDatabase } from '@config/kysely';

export async function paginate(
  query: SelectQueryBuilder<any, any, any>,
  database: KyselyDatabase,
  paramsConfig: PaginationConfig,
) {
  const { limit, page, tableName, getOriginalTotalItems } = paramsConfig;

  let totalItems: number;
  if (getOriginalTotalItems) {
    const response = await query.execute();
    totalItems = response.length;
  } else {
    const { count } = await database
      .selectFrom(tableName)
      .select((expressionBuilder) =>
        expressionBuilder.fn.countAll().as('count'),
      )
      .executeTakeFirstOrThrow();
    totalItems = Number(count);
  }

  const offset = (page - 1) * limit;
  query = query.limit(limit).offset(offset);

  const data = await query.execute();

  // get total page
  const totalPage = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      itemsPerPage: limit,
      totalItems,
      totalPage,
      currentPage: offset / limit + 1,
    },
  };
}
