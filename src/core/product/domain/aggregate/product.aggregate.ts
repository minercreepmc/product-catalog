import {
  ProductIdValueObject,
  ProductStatus,
  ProductStatusValueObject,
} from '@product-domain/value-objects';
import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import {
  AbstractAggregateRoot,
  InvalidOperationException,
  TextValueObject,
} from 'common-base-classes';
import {
  CreateProductAggregateOptions,
  ProductAggregateDetails,
  UpdateProductAggregateOptions,
} from './product.aggregate.interface';

export class ProductAggregate extends AbstractAggregateRoot<
  Partial<ProductAggregateDetails>
> {
  constructor(id?: ProductIdValueObject) {
    super({ id: id ? id : new ProductIdValueObject(), details: {} });
  }

  getStatus(): string {
    return this.details.status.unpack();
  }

  setStatus(newStatus: ProductStatus): void {
    this.details.status = new ProductStatusValueObject(newStatus);
  }

  get submittedBy(): ReviewerIdValueObject {
    return this.details.submittedBy;
  }

  set submittedBy(newSubmittedBy: ReviewerIdValueObject) {
    this.details.submittedBy = newSubmittedBy;
  }

  get approvedBy(): ReviewerIdValueObject {
    return this.details.approvedBy;
  }

  set approvedBy(newApprovedBy: ReviewerIdValueObject) {
    this.details.approvedBy = newApprovedBy;
  }

  get rejectedBy(): ReviewerIdValueObject {
    return this.details.rejectedBy;
  }

  set rejectedBy(newRejectedBy: ReviewerIdValueObject) {
    this.details.rejectedBy = newRejectedBy;
  }

  get rejectionReason(): TextValueObject {
    return this.details.rejectionReason;
  }

  set rejectionReason(newRejectionReason: TextValueObject) {
    this.details.rejectionReason = newRejectionReason;
  }

  createProduct(options: CreateProductAggregateOptions) {
    this.details.name = options.name;
    this.details.price = options.price;

    if (options.description) {
      this.details.description = options.description;
    }
    if (options.image) {
      this.details.image = options.image;
    }

    if (options.attributes) {
      this.details.attributes = options.attributes;
    }

    this.details.status = ProductStatusValueObject.draft();
  }

  updateProduct(options: UpdateProductAggregateOptions) {
    if (options.name) {
      this.details.name = options.name;
    }
    if (options.description) {
      this.details.description = options.description;
    }
    if (options.price) {
      this.details.price = options.price;
    }
    if (options.image) {
      this.details.image = options.image;
    }
    if (options.attributes) {
      this.details.attributes = options.attributes;
    }
  }

  submitForApproval(reviewerId: ReviewerIdValueObject) {
    if (this.getStatus() !== ProductStatus.DRAFT) {
      throw new InvalidOperationException(
        'Only draft products can be submitted for approval.',
      );
    }
    this.setStatus(ProductStatus.PENDING_APPROVAL);
    this.submittedBy = reviewerId;
  }

  isPendingApprovalBy(reviewerId: ReviewerIdValueObject): boolean {
    return (
      this.getStatus() === ProductStatus.PENDING_APPROVAL &&
      this.approvedBy === reviewerId
    );
  }

  approve(reviewerId: ReviewerIdValueObject) {
    if (this.getStatus() !== ProductStatus.PENDING_APPROVAL) {
      throw new InvalidOperationException(
        'Only products pending approval can be approved.',
      );
    }
    this.setStatus(ProductStatus.APPROVED);
    this.approvedBy = reviewerId;
  }

  reject(reviewerId: ReviewerIdValueObject, reason: TextValueObject) {
    if (this.getStatus() !== ProductStatus.PENDING_APPROVAL) {
      throw new InvalidOperationException(
        'Only products pending approval can be rejected.',
      );
    }
    this.setStatus(ProductStatus.REJECTED);
    this.rejectedBy = reviewerId;
    this.rejectionReason = reason;
  }
}
