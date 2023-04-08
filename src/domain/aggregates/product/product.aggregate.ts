import {
  ProductSubmittedDomainEvent,
  ProductCreatedDomainEvent,
  ProductUpdatedDomainEvent,
  ProductApprovedDomainEvent,
} from '@domain-events/product';
import {
  ProductIdValueObject,
  ProductStatusEnum,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  AbstractAggregateRoot,
  EntityOptions,
  InvalidOperationException,
  TextValueObject,
} from 'common-base-classes';
import {
  CreateProductAggregateOptions,
  ProductAggregateDetails,
  UpdateProductAggregateOptions,
} from './product.aggregate.interface';

type OptionalEntityOptions<T> = Partial<EntityOptions<T>>;

export class ProductAggregate extends AbstractAggregateRoot<
  Partial<ProductAggregateDetails>
> {
  constructor(options: OptionalEntityOptions<ProductAggregateDetails> = {}) {
    const defaultId = new ProductIdValueObject();
    const defaultDetails = {};
    const { id = defaultId, details = defaultDetails } = options ?? {};

    super({ id, details });

    const defaultStatus = ProductStatusValueObject.initial();
    const providedStatus = options?.details?.status;
    this.status = providedStatus ?? defaultStatus;
  }

  getStatus(): string {
    return this.details.status.unpack();
  }

  setStatus(newStatus: ProductStatusEnum): void {
    this.details.status = new ProductStatusValueObject(newStatus);
  }

  get status(): ProductStatusValueObject {
    return this.details.status;
  }

  set status(newStatus: ProductStatusValueObject) {
    this.details.status = newStatus;
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
    if (this.getStatus() === ProductStatusEnum.DRAFT) {
      throw new InvalidOperationException(
        'Cannot create a product that was created',
      );
    }
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

    this.setStatus(ProductStatusEnum.DRAFT);

    return new ProductCreatedDomainEvent({
      productId: this.id,
      details: {
        name: this.details.name,
        price: this.details.price,
        description: this.details.description,
        image: this.details.image,
      },
    });
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

    return new ProductUpdatedDomainEvent({
      productId: this.id,
      details: {
        name: this.details.name,
        price: this.details.price,
        description: this.details.description,
        image: this.details.image,
      },
    });
  }

  submitForApproval(reviewerId: ReviewerIdValueObject) {
    if (this.getStatus() !== ProductStatusEnum.DRAFT) {
      throw new InvalidOperationException(
        'Only draft products can be submitted for approval.',
      );
    }
    this.setStatus(ProductStatusEnum.PENDING_APPROVAL);
    this.submittedBy = reviewerId;

    return new ProductSubmittedDomainEvent({
      productId: this.id,
      details: {
        reviewerId: this.submittedBy,
        productStatus: this.status,
      },
    });
  }

  isSubmittedApprovalBy(reviewerId: ReviewerIdValueObject): boolean {
    return (
      this.getStatus() === ProductStatusEnum.PENDING_APPROVAL &&
      this.submittedBy === reviewerId
    );
  }

  approve(reviewerId: ReviewerIdValueObject) {
    if (this.getStatus() !== ProductStatusEnum.PENDING_APPROVAL) {
      throw new InvalidOperationException(
        'Only products pending approval can be approved.',
      );
    }
    this.setStatus(ProductStatusEnum.APPROVED);
    this.approvedBy = reviewerId;

    return new ProductApprovedDomainEvent({
      productId: this.id,
      details: {
        reviewerId,
        status: this.status,
      },
    });
  }

  reject(reviewerId: ReviewerIdValueObject, reason: TextValueObject) {
    if (this.getStatus() !== ProductStatusEnum.PENDING_APPROVAL) {
      throw new InvalidOperationException(
        'Only products pending approval can be rejected.',
      );
    }
    this.setStatus(ProductStatusEnum.REJECTED);
    this.rejectedBy = reviewerId;
    this.rejectionReason = reason;
  }
}
