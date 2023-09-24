import { AddressRepository } from '@database/repositories/pg/address';
import { ShippingFeeRepository } from '@database/repositories/pg/shipping';
import { UserRepository } from '@database/repositories/pg/user';
import { Module, Provider } from '@nestjs/common';
import { AddressExistsRule } from '@use-cases/command/address/rules/address-exists.rule';
import {
  ShippingFeeConflictRule,
  ShippingFeeExistsRule,
} from '@use-cases/command/shipping/rules';
import { ShipperExistsRule } from '@use-cases/command/users/rules';

const rules: Provider[] = [
  ShippingFeeExistsRule,
  ShippingFeeConflictRule,
  AddressExistsRule,
  ShipperExistsRule,
];

const repositories: Provider[] = [
  ShippingFeeRepository,
  AddressRepository,
  UserRepository,
];

@Module({
  providers: [...repositories, ...rules],
})
export class RulesModule {}
