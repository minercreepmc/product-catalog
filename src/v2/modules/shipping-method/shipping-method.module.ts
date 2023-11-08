import { Module } from '@nestjs/common';
import { ShippingMethodController } from './shipping-method.controller';
import { ShippingMethodRepository } from './shipping-method.repository';
import { ShippingMethodService } from './shipping-method.service';

@Module({
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService, ShippingMethodRepository],
})
export class ShippingMethodModule {}
