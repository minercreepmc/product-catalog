import { ProductAggregate, ProductAggregateDetails } from '@aggregates/product';
import { ProductRepositoryPort } from '@domain-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductNameValueObject } from '@value-objects/product';
import { AbstractTypeormRepository } from 'nest-typeorm-common-classes';
import { Repository } from 'typeorm';
import { ProductTypeOrmMapper } from './product.typeorm.mapper';
import { ProductTypeOrmModel } from './product.typeorm.model';
import { ProductTypeOrmQueryMapper } from './product.typeorm.query-mapper';

@Injectable()
export class ProductTypeOrmRepository
  extends AbstractTypeormRepository<
    ProductAggregate,
    ProductAggregateDetails,
    ProductTypeOrmModel
  >
  implements ProductRepositoryPort
{
  constructor(
    @InjectRepository(ProductTypeOrmModel)
    readonly typeOrmRepository: Repository<ProductTypeOrmModel>,
  ) {
    super(
      typeOrmRepository,
      new ProductTypeOrmMapper(ProductAggregate, ProductTypeOrmModel),
      new ProductTypeOrmQueryMapper(),
      new Logger(ProductTypeOrmRepository.name),
    );
  }
  async findOneByName(name: ProductNameValueObject): Promise<ProductAggregate> {
    const where = this.queryMapper.toQuery({ name });
    const model = await this.typeOrmRepository.findOne({ where });
    return model ? this.typeOrmMapper.toDomain(model) : null;
  }
}