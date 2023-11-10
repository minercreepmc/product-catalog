import { Injectable } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import type { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async create(userId: string, dto: CreateAddressDto) {
    return this.addressRepository.create(userId, dto);
  }

  async getAll(userId: string) {
    return this.addressRepository.getAll(userId);
  }

  async delete(id: string) {
    return this.addressRepository.delete(id);
  }

  async update(id: string, dto: UpdateAddressDto) {
    return this.addressRepository.update(id, dto);
  }
}
