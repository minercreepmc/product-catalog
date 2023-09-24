import { UserRepository } from '@database/repositories/pg/user';
import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function ShipperExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'ShipperExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ShipperExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'ShipperExists', async: true })
@Injectable()
export class ShipperExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly userRepo: UserRepository) {}
  async validate(id: string) {
    try {
      await this.userRepo.findShipperOrThrow(id);
    } catch (e) {
      return false;
    }
    return true;
  }
  defaultMessage?(): string {
    return 'Shipper not found';
  }
}
