import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseService } from '@base';
import { GlobalErrors } from '@constants';
import { ShippingMethodRepository } from './shipping-method.repository';
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
    let shippingMethods: ShippingMethodGetAllRO = { data: [] };
    try {
      const response = await this.shippingMethodRepository.findAll();
      shippingMethods = { data: response };
    } catch (error) {
      this.logger.error(error);
      const { status, code, message } =
        GlobalErrors.SHIPPING_METHOD.GET_ALL_FAILED;
      this.formatError(status, code, message);
    }

    return plainToInstance(ShippingMethodGetAllRO, shippingMethods, {
      excludeExtraneousValues: true,
    });
  }
}
