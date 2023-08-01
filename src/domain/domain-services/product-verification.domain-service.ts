import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  productRepositoryDiToken,
  ProductRepositoryPort,
} from '@domain-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';

@Injectable()
export class ProductVerificationDomainService {
  constructor(
    @Inject(productRepositoryDiToken)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async checkProductIdsMustExist(ids: ProductIdValueObject[]) {
    const isExist = await this.doesProductIdsExist(ids);

    if (!isExist) {
      throw new ProductDomainExceptions.DoesNotExist();
    }
  }

  async doesProductExistByName(name: ProductNameValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneByName(name));
  }

  async doesProductExistById(id: ProductIdValueObject): Promise<boolean> {
    return Boolean(await this.productRepository.findOneById(id));
  }

  async doesProductIdsExist(ids: ProductIdValueObject[]): Promise<boolean> {
    if (!ids || ids.length === 0) {
      return true;
    }

    const checks = await Promise.all(
      ids.map((id) => this.productRepository.findOneById(id)),
    );

    return checks.every((exist) => exist);
  }
}
