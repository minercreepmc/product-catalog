import {
  DiscountAggregate,
  DiscountAggregateCreateOptions,
  DiscountAggregateUpdateOptions,
} from '@aggregates/discount';
import {
  discountRepositoryDiToken,
  DiscountRepositoryPort,
  unitOfWorkDiToken,
  UnitOfWorkPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { DiscountIdValueObject } from '@value-objects/discount';
import { DiscountVerificationDomainService } from './discount-verification.domain-service';

export interface UpdateOptions {
  id: DiscountIdValueObject;
  payload: DiscountAggregateUpdateOptions;
}

export interface RemoveDiscountOptions {
  id: DiscountIdValueObject;
}

export interface RemoveDiscountsOptions {
  ids: DiscountIdValueObject[];
}

@Injectable()
export class DiscountManagementDomainService {
  constructor(
    @Inject(discountRepositoryDiToken)
    private readonly discountRepository: DiscountRepositoryPort,
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
    private readonly discountVerificationService: DiscountVerificationDomainService,
  ) {}
  async createDiscount(options: DiscountAggregateCreateOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      await this.discountVerificationService.findDiscountAndThrowIfExist(
        options.name,
      );
      const discountAggregate = new DiscountAggregate();
      const discountCreated = discountAggregate.createDiscount({
        name: options.name,
        description: options.description,
        percentage: options.percentage,
      });
      await this.discountRepository.create(discountAggregate);
      return discountCreated;
    });
  }

  async updateDiscount(options: UpdateOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const { id, payload } = options;
      const discount =
        await this.discountVerificationService.findDiscountOrThrow(id);
      const discountUpdated = discount.updateDiscount(payload);
      await this.discountRepository.updateOneById(id, discount);

      return discountUpdated;
    });
  }

  async removeDiscount(options: RemoveDiscountOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const discount =
        await this.discountVerificationService.findDiscountOrThrow(options.id);
      const discountRemoved = discount.removeDiscount();
      await this.discountRepository.deleteOneById(discount.id);

      return discountRemoved;
    });
  }

  async removeDiscounts(options: RemoveDiscountsOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const { ids } = options;
      const discounts =
        await this.discountVerificationService.findDiscountsOrThrow(ids);

      const discountRemoved = discounts.map((discount) => {
        const discountRemoved = discount.removeDiscount();
        return discountRemoved;
      });
      await this.discountRepository.deleteManyByIds(ids);

      return discountRemoved;
    });
  }
}
