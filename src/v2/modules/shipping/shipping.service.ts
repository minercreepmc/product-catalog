import { Injectable } from '@nestjs/common';
import { CreateShippingDto, UpdateShippingDto } from './dto';
import { ShippingRepository } from './shipping.repository';

@Injectable()
export class ShippingService {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  async create(dto: CreateShippingDto) {
    return this.shippingRepository.create(dto);
  }

  async update(id: string, dto: UpdateShippingDto) {
    return this.shippingRepository.update(id, dto);
  }

  async getOne(id: string) {
    return this.shippingRepository.findOne(id);
  }
}
