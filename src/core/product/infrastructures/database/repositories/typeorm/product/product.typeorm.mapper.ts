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

    if (ormModel.name) {
      name = new ProductNameValueObject(ormModel?.name);
    }

    if (ormModel.price) {
      price = ProductPriceValueObject.create(ormModel?.price);
    }

    if (ormModel.description) {
      description = new ProductDescriptionValueObject(ormModel?.description);
    }

    if (ormModel.image) {
      image = new ProductImageValueObject(ormModel?.image);
    }

    if (ormModel.attributes) {
      attributes = ProductAttributesValueObject.create(ormModel?.attributes);
    }

    if (ormModel.status) {
      status = new ProductStatusValueObject(ormModel?.status);
    }

    if (ormModel.submittedBy) {
      submittedBy = new ReviewerIdValueObject(ormModel?.submittedBy);
    }

    if (ormModel.approvedBy) {
      approvedBy = new ReviewerIdValueObject(ormModel?.approvedBy);
    }

    if (ormModel.rejectedBy) {
      rejectedBy = new ReviewerIdValueObject(ormModel?.rejectedBy);
    }

    if (ormModel.rejectionReason) {
      rejectionReason = new TextValueObject(ormModel?.rejectionReason);
    }

    return {
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
    };
  }
}
