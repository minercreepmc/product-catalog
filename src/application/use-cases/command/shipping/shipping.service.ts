import { CreateShippingDto, UpdateShippingDto } from '@api/http';
import { ShippingRepository } from '@database/repositories/pg/shipping';
import { Injectable } from '@nestjs/common';

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
