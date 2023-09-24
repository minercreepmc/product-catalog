import {
  CreateAddressDto,
  UpdateAddressDto,
} from '@api/http/v1/address.http.dto.v1';
import { AddressRepository } from '@database/repositories/pg/address';
import { Injectable } from '@nestjs/common';

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
