import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@reviewer-domain/aggregate';
import { ReviewerRepositoryPort } from '@reviewer-domain/interfaces';
import {
  ReviewerNameValueObject,
  ReviewerEmailValueObject,
} from '@reviewer-domain/value-objects';
import { AbstractTypeormRepository } from 'nest-typeorm-common-classes';
import { Repository } from 'typeorm';
import { ReviewerTypeOrmMapper } from './reviewer.typeorm.mapper';
import { ReviewerTypeOrmModel } from './reviewer.typeorm.model';
import { ReviewerTypeOrmQueryMapper } from './reviewer.typeorm.query-mapper';

@Injectable()
export class ReviewerTypeOrmRepository
  extends AbstractTypeormRepository<
    ReviewerAggregate,
    ReviewerAggregateDetails,
    ReviewerTypeOrmModel
  >
  implements ReviewerRepositoryPort
{
  constructor(
    @InjectRepository(ReviewerTypeOrmModel)
    typeOrmRepository: Repository<ReviewerTypeOrmModel>,
  ) {
    super(
      typeOrmRepository,
      new ReviewerTypeOrmMapper(ReviewerAggregate, ReviewerTypeOrmModel),
      new ReviewerTypeOrmQueryMapper(),
      new Logger(ReviewerTypeOrmRepository.name),
    );
  }
  async findOneByName(
    name: ReviewerNameValueObject,
  ): Promise<ReviewerAggregate> {
    const where = this.queryMapper.toQuery({ name });
    const model = await this.typeOrmRepository.findOne({ where });
    return model ? this.typeOrmMapper.toDomain(model) : null;
  }
  async findOneByEmail(
    email: ReviewerEmailValueObject,
  ): Promise<ReviewerAggregate> {
    const where = this.queryMapper.toQuery({ email });
    const model = await this.typeOrmRepository.findOne({ where });
    return model ? this.typeOrmMapper.toDomain(model) : null;
  }
}
