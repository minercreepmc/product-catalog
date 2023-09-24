import { AddressRepository } from '@database/repositories/pg/address';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function AddressExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'AddressExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: AddressExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'AddressExists', async: true })
@Injectable()
export class AddressExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly addressRepo: AddressRepository) {}
  async validate(id: string) {
    try {
      await this.addressRepo.findOneOrFail(id);
    } catch (e) {
      return false;
    }
    return true;
  }
  defaultMessage?(): string {
    return 'Address not found';
  }
}
