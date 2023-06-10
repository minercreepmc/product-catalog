import { ReviewerAggregateDetails } from '@aggregates/reviewer';
import {
  MikroOrmQueryMapper,
  OrmModelDetails,
} from '@utils/repositories/mikroorm';
import { QueryParams } from 'common-base-classes';
import { ReviewerMikroOrmModel } from './reviewer.mikroorm.model';

export type ReviewerQueryParams = QueryParams<ReviewerAggregateDetails>;
export type CategoryMikroOrmModelDetails = Partial<
  OrmModelDetails<ReviewerMikroOrmModel>
>;

export class ReviewerMikroOrmQueryMapper extends MikroOrmQueryMapper<
  ReviewerAggregateDetails,
  ReviewerMikroOrmModel
> {
  protected toQueryDetails(
    params: ReviewerQueryParams,
  ): CategoryMikroOrmModelDetails {
    const where: CategoryMikroOrmModelDetails = {};
    const { name, email, role } = params;

    if (name) {
      where.name = name.unpack();
    }

    if (role) {
      where.role = role.unpack();
    }

    if (email) {
      where.email = email.unpack();
    }

    return where;
  }
}
