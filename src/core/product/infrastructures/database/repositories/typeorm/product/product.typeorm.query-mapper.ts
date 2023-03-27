import { ProductAggregateDetails } from '@product-domain/aggregate';
import { IBaseEntity } from 'common-base-classes';
import { AbstractQueryMapper, WhereClause } from 'nest-typeorm-common-classes';
import { ProductTypeOrmModel } from './product.typeorm.model';

export type ProductQueryParams = Partial<IBaseEntity & ProductAggregateDetails>;

export class ProductTypeOrmQueryMapper extends AbstractQueryMapper<
  ProductAggregateDetails,
  ProductTypeOrmModel
> {
  toQuery(params: ProductQueryParams): WhereClause<ProductTypeOrmModel> {
    const where: WhereClause<ProductTypeOrmModel> = {};
    const {
      id,
      image,
      name,
      price,
      status,
      createdAt,
      updatedAt,
      approvedBy,
      attributes,
      rejectedBy,
      description,
      submittedBy,
      rejectionReason,
    } = params;

    if (id) {
      where.id = id.unpack();
    }

    if (image) {
      where.image = image.unpack();
    }

    if (name) {
      where.name = name.unpack();
    }

    if (price) {
      where.price = price.unpack();
    }
    if (status) {
      where.status = status.unpack();
    }

    if (createdAt) {
      where.createdAt = createdAt.unpack();
    }

    if (updatedAt) {
      where.updatedAt = updatedAt.unpack();
    }

    if (approvedBy) {
      where.approvedBy = approvedBy.unpack();
    }

    if (attributes) {
      where.attributes = attributes.unpack();
    }

    if (rejectedBy) {
      where.rejectedBy = rejectedBy.unpack();
    }

    if (description) {
      where.description = description.unpack();
    }

    if (submittedBy) {
      where.submittedBy = submittedBy.unpack();
    }

    if (rejectionReason) {
      where.rejectionReason = rejectionReason.unpack();
    }

    return where;
  }
}
