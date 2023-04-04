import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@reviewer-domain/aggregate';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';
import {
  AbstractTypeOrmMapper,
  OrmModelDetails,
} from 'nest-typeorm-common-classes';
import { ReviewerTypeOrmModel } from './reviewer.typeorm.model';

export class ReviewerTypeOrmMapper extends AbstractTypeOrmMapper<
  ReviewerAggregate,
  ReviewerAggregateDetails,
  ReviewerTypeOrmModel
> {
  protected toPersistanceDetails(
    entity: ReviewerAggregate,
  ): OrmModelDetails<ReviewerTypeOrmModel> {
    const { name, email } = entity.details;
    return {
      name: name?.unpack(),
      email: email?.unpack(),
    };
  }
  protected toDomainDetails(
    ormModel: ReviewerTypeOrmModel,
  ): ReviewerAggregateDetails {
    let name: ReviewerNameValueObject | undefined;
    let email: ReviewerEmailValueObject | undefined;

    if (ormModel.name) {
      name = new ReviewerNameValueObject(ormModel?.name);
    }

    if (ormModel.email) {
      email = new ReviewerEmailValueObject(ormModel?.email);
    }

    return {
      name,
      email,
    };
  }
}
