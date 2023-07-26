import { DiscountAggregate } from '@aggregates/discount';
import { DiscountRemovedDomainEvent } from '@domain-events/discount';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import {
  discountRepositoryDiToken,
  DiscountRepositoryPort,
  unitOfWorkDiToken,
  UnitOfWorkPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  DiscountActiveValueObject,
  DiscountDescriptionValueObject,
  DiscountIdValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';

export interface CreateOptions {
  name: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage: DiscountPercentageValueObject;
}

export interface UpdateOptions {
  id: DiscountIdValueObject;
  name?: DiscountNameValueObject;
  description?: DiscountDescriptionValueObject;
  percentage?: DiscountPercentageValueObject;
  active?: DiscountActiveValueObject;
}

export interface RemoveDiscountOptions {
  id: DiscountIdValueObject;
}

export interface RemoveDiscountsOptions {
  ids: DiscountIdValueObject[];
}

@Injectable()
export class DiscountManagementDomainService {
  async doesDiscountExistByName(
    name: DiscountNameValueObject,
  ): Promise<boolean> {
    const isExist = await this.discountRepository.findOneByName(name);

    return !!isExist;
  }

  async doesDiscountExistById(id: DiscountIdValueObject): Promise<boolean> {
    const isExist = await this.discountRepository.findOneById(id);

    return !!isExist;
  }

  async doesDiscountExistByIds(ids: DiscountIdValueObject[]) {
    for (const id of ids) {
      const isExist = await this.discountRepository.findOneById(id);

      if (!isExist) {
        return false;
      }
    }

    return true;
  }

  async createDiscount(options: CreateOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const isExist = await this.discountRepository.findOneByName(options.name);

      if (isExist) {
        throw new DiscountDomainExceptions.AlreadyExist();
      }

      const discount = new DiscountAggregate();

      const discountCreated = discount.createDiscount({
        name: options.name,
        description: options.description,
        percentage: options.percentage,
      });

      await this.discountRepository.create(discount);

      return discountCreated;
    });
  }

  async updateDiscount(options: UpdateOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const isExist = await this.discountRepository.findOneById(options.id);

      if (!isExist) {
        throw new DiscountDomainExceptions.DoesNotExist();
      }

      const discount = await this.discountRepository.findOneById(options.id);

      const discountUpdated = discount.updateDiscount(options);

      await this.discountRepository.updateOneById(options.id, discount);

      return discountUpdated;
    });
  }

  async removeDiscount(options: RemoveDiscountOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const isExist = await this.discountRepository.findOneById(options.id);

      if (!isExist) {
        throw new DiscountDomainExceptions.DoesNotExist();
      }

      const discount = await this.discountRepository.findOneById(options.id);
      const discountRemoved = discount.removeDiscount();

      await this.discountRepository.deleteOneById(options.id);

      return discountRemoved;
    });
  }

  async removeDiscounts(options: RemoveDiscountsOptions) {
    return this.unitOfWork.runInTransaction(async () => {
      const { ids } = options;
      const isExist = await this.doesDiscountExistByIds(ids);

      if (!isExist) {
        throw new DiscountDomainExceptions.DoesNotExist();
      }

      const events: DiscountRemovedDomainEvent[] = [];
      for (const id of ids) {
        const discount = await this.discountRepository.findOneById(id);
        const discountRemoved = discount.removeDiscount();
        await this.discountRepository.deleteOneById(id);
        events.push(discountRemoved);
      }

      return events;
    });
  }

  constructor(
    @Inject(discountRepositoryDiToken)
    private readonly discountRepository: DiscountRepositoryPort,
    @Inject(unitOfWorkDiToken)
    private readonly unitOfWork: UnitOfWorkPort,
  ) {}
}
