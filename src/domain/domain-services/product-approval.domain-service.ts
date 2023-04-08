import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
  reviewerRepositoryDiToken,
  ReviewerRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import {
  InvalidOperationException,
  TextValueObject,
} from 'common-base-classes';

export interface SubmitForApprovalDomainServiceOptions {
  productId: ProductIdValueObject;
  reviewerId: ReviewerIdValueObject;
}

export interface ApproveProductDomainServiceOptions {
  productId: ProductIdValueObject;
  reviewerId: ReviewerIdValueObject;
}

@Injectable()
export class ProductApprovalDomainService {
  constructor(
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(reviewerRepositoryDiToken)
    private readonly reviewerRepository: ReviewerRepositoryPort,
  ) {}

  async submitForApproval(
    options: SubmitForApprovalDomainServiceOptions,
  ): Promise<ProductSubmittedDomainEvent> {
    const { productId, reviewerId } = options;
    const product = await this.productRepository.findOneById(productId);
    if (!product) {
      throw new ProductDomainExceptions.DoesNotExist();
    }

    const reviewer = await this.reviewerRepository.findOneById(reviewerId);
    if (!reviewer) {
      throw new ReviewerDomainExceptions.DoesNotExist();
    }

    const productSubmitted = product.submitForApproval(reviewerId);
    await this.productRepository.save(product);

    return productSubmitted;
  }

  async approveProduct(options: ApproveProductDomainServiceOptions) {
    const { reviewerId, productId } = options;
    const product = await this.productRepository.findOneById(productId);

    if (!product) {
      throw new ProductDomainExceptions.DoesNotExist();
    }

    const reviewer = await this.reviewerRepository.findOneById(reviewerId);

    if (!reviewer) {
      throw new ReviewerDomainExceptions.DoesNotExist();
    }

    if (!reviewer.role.isAdmin()) {
      throw new ReviewerDomainExceptions.NotAuthorizedToApprove();
    }

    const productApproved = product.approve(reviewerId);
    await this.productRepository.save(product);

    return productApproved;
  }

  async rejectProduct(
    productId: ProductIdValueObject,
    reviewerId: ReviewerIdValueObject,
    reason: TextValueObject,
  ) {
    const product = await this.productRepository.findOneById(productId);

    if (!product.isSubmittedApprovalBy(reviewerId)) {
      throw new InvalidOperationException(
        'This product is not pending approval by this reviewer',
      );
    }

    product.reject(reviewerId, reason);
    await this.productRepository.save(product);
  }
}
