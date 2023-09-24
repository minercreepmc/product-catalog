import { ShippingFeeRepository } from '@database/repositories/pg/shipping';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ShippingFeeExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ShippingFeeExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ShippingFeeExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'ShippingFeeExists', async: true })
@Injectable()
export class ShippingFeeExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly shippingFeeRepo: ShippingFeeRepository) {}
  async validate(id: string) {
    try {
      await this.shippingFeeRepo.findOneOrFail(id);
    } catch (e) {
      return false;
    }
    return true;
  }
  defaultMessage?(): string {
    return 'Shipping fee not found';
  }
}
