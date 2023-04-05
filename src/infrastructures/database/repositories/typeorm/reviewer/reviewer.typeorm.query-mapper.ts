import { ReviewerAggregateDetails } from '@aggregates/reviewer';
import { IBaseEntity } from 'common-base-classes';
import { AbstractQueryMapper, WhereClause } from 'nest-typeorm-common-classes';
import { ReviewerTypeOrmModel } from './reviewer.typeorm.model';

export type ReviewerQueryParams = Partial<
  IBaseEntity & ReviewerAggregateDetails
>;

export class ReviewerTypeOrmQueryMapper extends AbstractQueryMapper<
  ReviewerAggregateDetails,
  ReviewerTypeOrmModel
> {
  toQuery(params: ReviewerQueryParams): WhereClause<ReviewerTypeOrmModel> {
    const where: WhereClause<ReviewerTypeOrmModel> = {};
    const { id, name, email, createdAt, updatedAt } = params;

    if (id) {
      where.id = id.unpack();
    }

    if (name) {
      where.name = name.unpack();
    }

    if (email) {
      where.email = email.unpack();
    }

    if (createdAt) {
      where.createdAt = createdAt.unpack();
    }

    if (updatedAt) {
      where.updatedAt = updatedAt.unpack();
    }

    return where;
  }
}
