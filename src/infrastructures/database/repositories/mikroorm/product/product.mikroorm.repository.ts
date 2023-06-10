import { ProductAggregate, ProductAggregateDetails } from '@aggregates/product';
import { ProductRepositoryPort } from '@domain-interfaces';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { MikroOrmRepositoryBase } from '@utils/repositories/mikroorm';
import { ProductNameValueObject } from '@value-objects/product';
import { ProductMikroOrmMapper } from './product.mikroorm.mapper';
import { ProductMikroOrmModel } from './product.mikroorm.model';
import { ProductMikroOrmQueryMapper } from './product.mikroorm.query-mapper';

@Injectable()
export class ProductMikroOrmRepository
  extends MikroOrmRepositoryBase<
    ProductAggregate,
    ProductAggregateDetails,
    ProductMikroOrmModel
  >
  implements ProductRepositoryPort
{
  constructor(entityManager: EntityManager) {
    super(
      entityManager,
      new ProductMikroOrmMapper(ProductAggregate, ProductMikroOrmModel),
      new ProductMikroOrmQueryMapper(),
      ProductMikroOrmModel,
      new Logger(ProductMikroOrmRepository.name),
    );
  }
  async findOneByName(name: ProductNameValueObject): Promise<ProductAggregate> {
    const query = this.queryMapper.toQuery({
      name,
    });

    const found = await this.entityManager.findOne(ProductMikroOrmModel, query);

    return found ? this.mapper.toDomain(found) : null;
  }
}
