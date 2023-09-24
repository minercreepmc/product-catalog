import { ShippingFeeRepository } from '@database/repositories/pg/shipping';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ShippingFeeConflict(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ShippingConflict',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ShippingFeeConflictRule,
    });
  };
}

@ValidatorConstraint({ name: 'ShippingConflict', async: true })
@Injectable()
export class ShippingFeeConflictRule implements ValidatorConstraintInterface {
  constructor(private readonly shippingFeeRepo: ShippingFeeRepository) {}
  async validate(name: string) {
    try {
      await this.shippingFeeRepo.findOneByNameOrFailIfExist(name);
    } catch (e) {
      return false;
    }
    return true;
  }
  defaultMessage?(): string {
    return 'Shipping fee already exists';
  }
}
