import { Injectable } from '@nestjs/common';
import { CreateShippingFeeDto } from './dto';
import { ShippingFeeRepository } from './shipping-fee.repository';

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
