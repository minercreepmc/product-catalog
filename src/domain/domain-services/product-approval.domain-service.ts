import { ProductSubmittedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
  reviewerRepositoryDiToken,
  ReviewerRepositoryPort,
  unitOfWorkDiToken,
  UnitOfWorkPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';

export interface SubmitForApprovalDomainServiceOptions {
  productId: ProductIdValueObject;
  reviewerId: ReviewerIdValueObject;
}

export interface ApproveProductDomainServiceOptions {
  productId: ProductIdValueObject;
  reviewerId: ReviewerIdValueObject;
}

export interface RejectProductDomainServiceOptions {
  productId: ProductIdValueObject;
  reviewerId: ReviewerIdValueObject;
  reason: RejectionReasonValueObject;
}

@Injectable()
export class ProductApprovalDomainService {
  constructor(
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
    @Inject(reviewerRepositoryDiToken)
    private readonly reviewerRepository: ReviewerRepositoryPort,
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}

  async submitForApproval(
    options: SubmitForApprovalDomainServiceOptions,
  ): Promise<ProductSubmittedDomainEvent> {
    return this.unitOfWork.runInTransaction(async () => {
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
    });
  }

  async approveProduct(options: ApproveProductDomainServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
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
    });
  }

  async rejectProduct(options: RejectProductDomainServiceOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const { productId, reviewerId, reason } = options;
      const product = await this.productRepository.findOneById(productId);

      if (!product) {
        throw new ProductDomainExceptions.DoesNotExist();
      }

      const reviewer = await this.reviewerRepository.findOneById(reviewerId);

      if (!reviewer) {
        throw new ReviewerDomainExceptions.DoesNotExist();
      }

      if (!reviewer.role.isAdmin()) {
        throw new ReviewerDomainExceptions.NotAuthorizedToReject();
      }

      const productRejected = product.reject(reviewerId, reason);
      await this.productRepository.save(product);

      return productRejected;
    });
  }
}
