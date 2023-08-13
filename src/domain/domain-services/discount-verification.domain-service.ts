import { DiscountAggregate } from '@aggregates/discount';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import {
  discountRepositoryDiToken,
  DiscountRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  DiscountIdValueObject,
  DiscountNameValueObject,
} from '@value-objects/discount';

@Injectable()
export class DiscountVerificationDomainService {
  constructor(
    @Inject(discountRepositoryDiToken)
    private readonly discountRepository: DiscountRepositoryPort,
  ) {}
  async findDiscountOrThrow(id: DiscountIdValueObject) {
    const discount = await this.discountRepository.findOneById(id);
    if (!discount) throw new DiscountDomainExceptions.DoesNotExist();
    return discount;
  }
  async findDiscountAndThrowIfExist(name: DiscountNameValueObject) {
    const isExist = await this.discountRepository.findOneByName(name);

    if (isExist) {
      throw new DiscountDomainExceptions.AlreadyExist();
    }
  }

  async findDiscountsOrThrow(
    ids: DiscountIdValueObject[],
  ): Promise<DiscountAggregate[]> {
    const discounts: DiscountAggregate[] = [];

    for (const id of ids) {
      const discount = await this.findDiscountOrThrow(id);
      discounts.push(discount);
    }

    return discounts;
  }

  async doesDiscountsExist(ids: DiscountIdValueObject[]) {
    return ids.every(
      async (id) => await this.discountRepository.findOneById(id),
    );
  }

  async doesDiscountNameExist(name: DiscountNameValueObject): Promise<boolean> {
    const isExist = await this.discountRepository.findOneByName(name);

    return !!isExist;
  }

  async doesDiscountIdExist(id: DiscountIdValueObject): Promise<boolean> {
    const isExist = await this.discountRepository.findOneById(id);

    return !!isExist;
  }

  async doesDiscountIdsExist(ids: DiscountIdValueObject[]) {
    for (const id of ids) {
      const isExist = await this.discountRepository.findOneById(id);

      if (!isExist) {
        return false;
      }
    }

    return true;
  }
}
