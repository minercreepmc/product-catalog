import {
  CategoryAggregate,
  CategoryAggregateDetails,
} from '@aggregates/category';
import { CategoryRepositoryPort } from '@domain-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryNameValueObject } from '@value-objects/category';
import { AbstractTypeormRepository } from 'nest-typeorm-common-classes';
import { Repository } from 'typeorm';
import { CategoryTypeOrmMapper } from './category.typeorm.mapper';
import { CategoryTypeOrmModel } from './category.typeorm.model';
import { CategoryTypeOrmQueryMapper } from './category.typeorm.query-mapper';

@Injectable()
export class CategoryTypeOrmRepository
  extends AbstractTypeormRepository<
    CategoryAggregate,
    CategoryAggregateDetails,
    CategoryTypeOrmModel
  >
  implements CategoryRepositoryPort
{
  constructor(
    @InjectRepository(CategoryTypeOrmModel)
    readonly typeOrmRepository: Repository<CategoryTypeOrmModel>,
  ) {
    super(
      typeOrmRepository,
      new CategoryTypeOrmMapper(CategoryAggregate, CategoryTypeOrmModel),
      new CategoryTypeOrmQueryMapper(),
      new Logger(CategoryTypeOrmRepository.name),
    );
  }
  async findOneByName(
    name: CategoryNameValueObject,
  ): Promise<CategoryAggregate> {
    const where = this.queryMapper.toQuery({ name });
    const model = await this.typeOrmRepository.findOne({ where });
    return model ? this.typeOrmMapper.toDomain(model) : null;
  }
}
