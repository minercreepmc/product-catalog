import { Module } from '@nestjs/common';
import { CartRepository } from '@v2/cart';
import { ShippingFeeDeletedListener } from './shipping-fee-deleted.listener';

@Module({
  providers: [ShippingFeeDeletedListener, CartRepository],
})
export class ShippingFeeDeletedModule {}
