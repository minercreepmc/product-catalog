import { Module } from '@nestjs/common';
import { CartRepository } from '@v2/cart';
import { AddressDeletedListener } from './address-deleted.listener';

@Module({
  providers: [AddressDeletedListener, CartRepository],
})
export class AddressDeletedModule {}
