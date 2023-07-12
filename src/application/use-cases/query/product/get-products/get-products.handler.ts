import { ProductMikroOrmModel } from '@database/repositories/mikroorm/product';
import { EntityManager } from '@mikro-orm/postgresql';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductViewModel } from '../product.model';
import { ProductQuery } from '../product.query';
import { GetProductsQuery } from './get-products.query';

export type GetProductsResponseDto = {
  products: ProductViewModel[];
};

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<ProductQuery, GetProductsResponseDto>
{
  async execute(query: ProductQuery): Promise<GetProductsResponseDto> {
    const products = await this.entityManager.find(
      ProductMikroOrmModel,
      {},
      query,
    );
    return {
      products,
    };
  }

  constructor(private readonly entityManager: EntityManager) {}
}
