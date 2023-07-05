import { ProductMikroOrmModel } from '@database/repositories/mikroorm/product';
import { EntityManager } from '@mikro-orm/postgresql';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductViewModel } from '../product.model';
import { ProductQuery } from '../product.query';

export type GetProductsResponseDto = ProductViewModel[];

@QueryHandler(ProductQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<ProductQuery, GetProductsResponseDto>
{
  async execute(query: ProductQuery): Promise<GetProductsResponseDto> {
    return this.entityManager.find(ProductMikroOrmModel, {}, query);
  }

  constructor(private readonly entityManager: EntityManager) {}
}
