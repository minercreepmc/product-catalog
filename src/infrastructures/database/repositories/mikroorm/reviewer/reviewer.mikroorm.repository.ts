import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@aggregates/reviewer';
import { ReviewerRepositoryPort } from '@domain-interfaces';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { MikroOrmRepositoryBase } from '@utils/repositories/mikroorm';
import {
  ReviewerNameValueObject,
  ReviewerEmailValueObject,
} from '@value-objects/reviewer';
import { ReviewerMikroOrmMapper } from './reviewer.mikroorm.mapper';
import { ReviewerMikroOrmModel } from './reviewer.mikroorm.model';
import { ReviewerMikroOrmQueryMapper } from './reviewer.mikroorm.query-mapper';

@Injectable()
export class ReviewerMikroOrmRepository
  extends MikroOrmRepositoryBase<
    ReviewerAggregate,
    ReviewerAggregateDetails,
    ReviewerMikroOrmModel
  >
  implements ReviewerRepositoryPort
{
  constructor(entityManager: EntityManager) {
    super(
      entityManager,
      new ReviewerMikroOrmMapper(ReviewerAggregate, ReviewerMikroOrmModel),
      new ReviewerMikroOrmQueryMapper(),
      ReviewerMikroOrmModel,
      new Logger(ReviewerMikroOrmRepository.name),
    );
  }

  findOneByName(name: ReviewerNameValueObject): Promise<ReviewerAggregate> {
    return this.findOne({ name });
  }
  findOneByEmail(email: ReviewerEmailValueObject): Promise<ReviewerAggregate> {
    return this.findOne({ email });
  }
}
