import { ReviewerAggregateDetails } from '@aggregates/reviewer';
import {
  MikroOrmQueryMapper,
  OrmModelDetails,
} from '@utils/base/database/repositories/mikroorm';
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
    const { name, role } = params;

    if (name) {
      where.name = name.unpack();
    }

    if (role) {
      where.role = role.unpack();
    }

    return where;
  }
}
