import { KyselyTables } from '@config/kysely';
import { PaginationParams } from './pagination-params.dto';

export class PaginationConfig extends PaginationParams {
  tableName: keyof KyselyTables;
  getOriginalTotalItems: boolean;
}
