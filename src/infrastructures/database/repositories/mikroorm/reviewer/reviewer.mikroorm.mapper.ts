import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@aggregates/reviewer';
import {
  MikroOrmMapperBase,
  OrmModelDetails,
} from '@utils/base/database/repositories/mikroorm';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { ReviewerMikroOrmModel } from './reviewer.mikroorm.model';

export type ReviewerMikroOrmModelDetails =
  OrmModelDetails<ReviewerMikroOrmModel>;

export class ReviewerMikroOrmMapper extends MikroOrmMapperBase<
  ReviewerAggregate,
  ReviewerAggregateDetails,
  ReviewerMikroOrmModel
> {
  protected async toPersistanceDetails(
    entity: ReviewerAggregate,
  ): Promise<ReviewerMikroOrmModelDetails> {
    const { name, email, role } = entity.details;
    return {
      name: name?.unpack(),
      email: email?.unpack(),
      role: role?.unpack(),
    };
  }
  protected async toDomainDetails(
    ormModel: ReviewerMikroOrmModel,
  ): Promise<ReviewerAggregateDetails> {
    let name: ReviewerNameValueObject | undefined;
    let email: ReviewerEmailValueObject | undefined;
    let role: ReviewerRoleValueObject | undefined;

    if (ormModel.name) {
      name = new ReviewerNameValueObject(ormModel?.name);
    }

    if (ormModel.email) {
      email = new ReviewerEmailValueObject(ormModel?.email);
    }

    if (ormModel.role) {
      role = new ReviewerRoleValueObject(ormModel?.role);
    }
    return {
      name,
      email,
      role,
    };
  }
}
