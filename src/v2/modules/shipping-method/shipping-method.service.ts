import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseService } from '@base-class';
import { GlobalErrors } from '@constants';
import type { ShippingMethodRepository } from './shipping-method.repository';
import { ShippingMethodGetAllRO } from './ro';

@Injectable()
export class ShippingMethodService extends BaseService {
  logger = new Logger(ShippingMethodService.name);
  constructor(
    private readonly shippingMethodRepository: ShippingMethodRepository,
  ) {
    super();
  }

  async getAll() {
    let shippingMethods: ShippingMethodGetAllRO[] = [];
    try {
      const response = await this.shippingMethodRepository.findAll();
      shippingMethods = plainToInstance(ShippingMethodGetAllRO, response, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(error);
      const { status, code, message } =
        GlobalErrors.SHIPPING_METHOD.GET_ALL_FAILED;
      this.formatError(status, code, message);
    }
    return this.formatData(HttpStatus.OK, shippingMethods);
  }
}
