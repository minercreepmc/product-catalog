import { DiscountAggregate } from '@aggregates/discount';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import {
  discountRepositoryDiToken,
  DiscountRepositoryPort,
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
    console.log(isExist);

    return !!isExist;
  }

  async createDiscount(options: CreateOptions) {
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
  }

  async updateDiscount(options: UpdateOptions) {
    const isExist = await this.discountRepository.findOneById(options.id);

    if (!isExist) {
      throw new DiscountDomainExceptions.DoesNotExist();
    }

    const discount = await this.discountRepository.findOneById(options.id);

    const discountUpdated = discount.updateDiscount(options);

    await this.discountRepository.updateOneById(options.id, discount);

    return discountUpdated;
  }

  constructor(
    @Inject(discountRepositoryDiToken)
    private readonly discountRepository: DiscountRepositoryPort,
  ) {}
}
