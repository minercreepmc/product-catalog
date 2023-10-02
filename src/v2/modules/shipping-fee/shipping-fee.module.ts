import { Module } from '@nestjs/common';
import { ShippingFeeController } from './shipping-fee.controller';
import { ShippingFeeRepository } from './shipping-fee.repository';
import { ShippingFeeService } from './shipping-fee.service';

@Module({
  controllers: [ShippingFeeController],
  providers: [ShippingFeeService, ShippingFeeRepository],
})
export class ShippingFeeModule {}
