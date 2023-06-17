import {
  ReviewerAggregate,
  ReviewerAggregateDetails,
} from '@aggregates/reviewer';
import {
  MikroOrmMapperBase,
  OrmModelDetails,
} from '@utils/base/database/repositories/mikroorm';
import {
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
    const { name, role } = entity.details;
    return {
      name: name?.unpack(),
      role: role?.unpack(),
    };
  }
  protected async toDomainDetails(
    ormModel: ReviewerMikroOrmModel,
  ): Promise<ReviewerAggregateDetails> {
    let name: ReviewerNameValueObject | undefined;
    let role: ReviewerRoleValueObject | undefined;

    if (ormModel.name) {
      name = new ReviewerNameValueObject(ormModel?.name);
    }

    if (ormModel.role) {
      role = new ReviewerRoleValueObject(ormModel?.role);
    }

    return {
      name,
      role,
    };
  }
}
