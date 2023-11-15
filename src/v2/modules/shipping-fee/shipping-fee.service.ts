import { Injectable } from '@nestjs/common';
import { ShippingFeeRepository } from './shipping-fee.repository';
import type { CreateShippingFeeDto, UpdateShippingFeeDto } from './dto';
import { plainToInstance } from 'class-transformer';
import {
  ShippingFeeGetAllRO,
  ShippingFeeGetOneRO,
  ShippingFeeStoreRO,
  ShippingFeeUpdateRO,
} from './ro/shipping-fee.ro';
import { ResultRO } from '@common/ro';
import { BaseService } from '@base';
import { GlobalErrors } from '@constants';

@Injectable()
export class ShippingFeeService extends BaseService {
  constructor(private readonly shippingFeeRepository: ShippingFeeRepository) {
    super();
  }

  async store(dto: CreateShippingFeeDto) {
    await this.validateStore(dto);

    const response = await this.shippingFeeRepository.store(dto);

    return plainToInstance(ShippingFeeStoreRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: CreateShippingFeeDto) {
    await this.validateUpdate(id, dto);

    const response = await this.shippingFeeRepository.update(id, dto);

    return plainToInstance(ShippingFeeUpdateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string) {
    await this.shippingFeeRepository.delete(id);

    return plainToInstance(ResultRO, {
      result: true,
    });
  }

  async getAll() {
    const data = await this.shippingFeeRepository.findAll();
    return plainToInstance(
      ShippingFeeGetAllRO,
      { data },
      { excludeExtraneousValues: true },
    );
  }

  async getOne(id: string) {
    const data = await this.shippingFeeRepository.findOne(id);
    return plainToInstance(ShippingFeeGetOneRO, data, {
      excludeExtraneousValues: true,
    });
  }

  private async validateStore(dto: CreateShippingFeeDto) {
    const data = await this.shippingFeeRepository.findOneByName(dto.name);

    if (data) {
      const { status, code, message } =
        GlobalErrors.SHIPPING_FEE.NAME_ALREADY_EXISTS;
      this.formatError(status, code, message);
    }
  }

  private async validateUpdate(id: string, dto: UpdateShippingFeeDto) {
    const data = await this.shippingFeeRepository.findOne(id);

    if (!data) {
      const { status, code, message } = GlobalErrors.SHIPPING_FEE.IS_NOT_EXIST;
      this.formatError(status, code, message);
    }

    const dataByName = await this.shippingFeeRepository.findOneByName(dto.name);

    if (dataByName) {
      const { status, code, message } =
        GlobalErrors.SHIPPING_FEE.NAME_ALREADY_EXISTS;
      this.formatError(status, code, message);
    }
  }
}
