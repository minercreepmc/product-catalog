import { Inject, Injectable } from '@nestjs/common';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@product-domain/interfaces';
import { ProductIdValueObject } from '@product-domain/value-objects';
import { ReviewerIdValueObject } from '@reviewer-domain/value-objects';
import {
  InvalidOperationException,
  TextValueObject,
} from 'common-base-classes';

@Injectable()
export class ProductApprovalDomainService {
  constructor(
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async submitForApproval(
    productId: ProductIdValueObject,
    reviewerId: ReviewerIdValueObject,
  ) {
    const product = await this.productRepository.findOneById(productId);

    product.submitForApproval(reviewerId);
    await this.productRepository.save(product);
  }

  async approveProduct(
    productId: ProductIdValueObject,
    reviewerId: ReviewerIdValueObject,
  ) {
    const product = await this.productRepository.findOneById(productId);

    if (!product.isPendingApprovalBy(reviewerId)) {
      throw new InvalidOperationException(
        'This product is not pending approval by this reviewer',
      );
    }

    product.approve(reviewerId);
    await this.productRepository.save(product);
  }

  async rejectProduct(
    productId: ProductIdValueObject,
    reviewerId: ReviewerIdValueObject,
    reason: TextValueObject,
  ) {
    const product = await this.productRepository.findOneById(productId);

    if (!product.isPendingApprovalBy(reviewerId)) {
      throw new InvalidOperationException(
        'This product is not pending approval by this reviewer',
      );
    }

    product.reject(reviewerId, reason);
    await this.productRepository.save(product);
  }
}
