import { Injectable } from '@nestjs/common';
import { ShippingFeeRepository } from './shipping-fee.repository';
import type { CreateShippingFeeDto } from './dto';

@Injectable()
export class ShippingFeeService {
  constructor(private readonly shippingFeeRepository: ShippingFeeRepository) {}

  async create(dto: CreateShippingFeeDto) {
    return this.shippingFeeRepository.create(dto);
  }

  async update(id: string, dto: CreateShippingFeeDto) {
    return this.shippingFeeRepository.update(id, dto);
  }

  async delete(id: string) {
    return this.shippingFeeRepository.delete(id);
  }

  async getAll() {
    return this.shippingFeeRepository.findAll();
  }

  async getOne(id: string) {
    return this.shippingFeeRepository.findOne(id);
  }
}
