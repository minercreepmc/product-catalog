import {
  ProductAggregate,
  ProductAggregateDetails,
} from '@product-domain/aggregate';
import {
  ProductAttributesValueObject,
  ProductDescriptionValueObject,
  ProductImageValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductStatusValueObject,
} from '@product-domain/value-objects';
import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import { TextValueObject } from 'common-base-classes';
import {
  AbstractTypeOrmMapper,
  OrmModelDetails,
} from 'nest-typeorm-common-classes';
import { ProductTypeOrmModel } from './product.typeorm.model';

export class ProductTypeOrmMapper extends AbstractTypeOrmMapper<
  ProductAggregate,
  ProductAggregateDetails,
  ProductTypeOrmModel
> {
  protected toPersistanceDetails(
    entity: ProductAggregate,
  ): OrmModelDetails<ProductTypeOrmModel> {
    const {
      name,
      price,
      description,
      image,
      attributes,
      status,
      submittedBy,
      approvedBy,
      rejectedBy,
      rejectionReason,
    } = entity.details;
    return {
      name: name?.unpack(),
      price: price?.unpack(),
      description: description?.unpack(),
      image: image?.unpack(),
      attributes: attributes?.unpack(),
      status: status?.unpack(),
      submittedBy: submittedBy?.unpack(),
      approvedBy: approvedBy?.unpack(),
      rejectedBy: rejectedBy?.unpack(),
      rejectionReason: rejectionReason?.unpack(),
    };
  }
  protected toDomainDetails(
    ormModel: ProductTypeOrmModel,
  ): ProductAggregateDetails {
    let name: ProductNameValueObject | undefined;
    let price: ProductPriceValueObject | undefined;
    let description: ProductDescriptionValueObject | undefined;
    let image: ProductImageValueObject | undefined;
    let attributes: ProductAttributesValueObject | undefined;
    let status: ProductStatusValueObject | undefined;
    let submittedBy: ReviewerIdValueObject | undefined;
    let approvedBy: ReviewerIdValueObject | undefined;
    let rejectedBy: ReviewerIdValueObject | undefined;
    let rejectionReason: TextValueObject | undefined;

    if (name) {
      name = new ProductNameValueObject(ormModel?.name);
    }

    if (price) {
      price = ProductPriceValueObject.create(ormModel?.price);
    }

    if (description) {
      description = new ProductDescriptionValueObject(ormModel?.description);
    }

    if (image) {
      image = new ProductImageValueObject(ormModel?.image);
    }

    if (attributes) {
      attributes = ProductAttributesValueObject.create(ormModel?.attributes);
    }

    if (status) {
      status = new ProductStatusValueObject(ormModel?.status);
    }

    if (submittedBy) {
      submittedBy = new ReviewerIdValueObject(ormModel?.submittedBy);
    }

    if (approvedBy) {
      approvedBy = new ReviewerIdValueObject(ormModel?.approvedBy);
    }

    if (rejectedBy) {
      rejectedBy = new ReviewerIdValueObject(ormModel?.rejectedBy);
    }

    if (rejectionReason) {
      rejectionReason = new TextValueObject(ormModel?.rejectionReason);
    }

    return {
      name: new ProductNameValueObject(ormModel?.name),
      price: ProductPriceValueObject.create(ormModel?.price),
      description,
      image,
      attributes,
      status,
      submittedBy,
      approvedBy,
      rejectedBy,
      rejectionReason,
    };
  }
}
