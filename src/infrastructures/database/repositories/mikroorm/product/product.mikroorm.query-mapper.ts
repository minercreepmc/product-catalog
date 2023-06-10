import { ProductAggregateDetails } from '@aggregates/product';
import {
  MikroOrmQueryMapper,
  OrmModelDetails,
} from '@utils/repositories/mikroorm';
import { IBaseEntity } from 'common-base-classes';
import { ProductMikroOrmModel } from './product.mikroorm.model';

export type ProductQueryParams = Partial<IBaseEntity & ProductAggregateDetails>;
export type ProductMikroOrmModelDetails = Partial<
  OrmModelDetails<ProductMikroOrmModel>
>;

export class ProductMikroOrmQueryMapper extends MikroOrmQueryMapper<
  ProductAggregateDetails,
  ProductMikroOrmModel
> {
  protected toQueryDetails(
    details: ProductAggregateDetails,
  ): ProductMikroOrmModelDetails {
    const where: ProductMikroOrmModelDetails = {};
    const {
      image,
      name,
      price,
      status,
      approvedBy,
      attributes,
      rejectedBy,
      description,
      submittedBy,
      rejectionReason,
    } = details;

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
