import { ProductRepository } from '@database/repositories/pg/product';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ProductsExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ProductExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ProductsExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class ProductsExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly productRepo: ProductRepository) {}

  async validate(ids: string[]) {
    try {
      ids.map(async (id) => {
        await this.productRepo.findOneOrFail(id);
      });
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage?(): string {
    return 'Product not found';
  }
}
