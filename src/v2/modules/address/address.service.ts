import { BaseService } from '@base';
import { ResultRO } from '@common/ro';
import { GlobalErrors } from '@constants';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AddressRepository } from './address.repository';
import type { CreateAddressDto, UpdateAddressDto } from './dto';
import { AddressCreateRO, AddressGetAllRO, AddressUpdateRO } from './ro';

@Injectable()
export class AddressService extends BaseService {
  constructor(private readonly addressRepository: AddressRepository) {
    super();
  }

  async store(userId: string, dto: CreateAddressDto) {
    await this.validateStore(dto);

    const response = await this.addressRepository.store(userId, dto);

    return plainToInstance(AddressCreateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getAll(userId: string) {
    const response = await this.addressRepository.getAll(userId);
    return plainToInstance(
      AddressGetAllRO,
      { data: response },
      { excludeExtraneousValues: true },
    );
  }

  async delete(id: string) {
    await this.addressRepository.delete(id);
    return plainToInstance(ResultRO, { result: true });
  }

  async update(id: string, dto: UpdateAddressDto) {
    await this.validateUpdate(id);

    const response = await this.addressRepository.update(id, dto);

    return plainToInstance(AddressUpdateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  private async validateStore(dto: CreateAddressDto) {
    const data = await this.addressRepository.findByLocation(dto.location);

    if (data) {
      const { status, code, message } =
        GlobalErrors.ADDRESS.LOCATION_ALREADY_EXISTS;
      this.formatError(status, code, message);
    }
  }

  private async validateUpdate(id: string) {
    const data = await this.addressRepository.findOne(id);

    if (!data) {
      const { status, code, message } = GlobalErrors.ADDRESS.IS_NOT_EXIST;
      this.formatError(status, code, message);
    }
  }
}
