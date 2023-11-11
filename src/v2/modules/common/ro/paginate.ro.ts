import { Expose } from 'class-transformer';

export class PaginiateMetaRO {
  @Expose()
  itemsPerPage: number;

  @Expose()
  totalItems: number;

  @Expose()
  totalPage: number;

  @Expose()
  currentPage: number;
}

export abstract class PaginateRO<PaginateDataRO> {
  abstract data: PaginateDataRO[];

  @Expose()
  meta: PaginiateMetaRO;
}
