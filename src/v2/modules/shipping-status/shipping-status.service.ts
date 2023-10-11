import { Injectable } from '@nestjs/common';
import { CreateShippingStatusDto, UpdateShippingStatusDto } from './dto';
import { ShippingStatusRepository } from './shipping-status.repository';

@Injectable()
export class ShippingStatusService {
  constructor(private shippingStatusRepo: ShippingStatusRepository) {}
  create(dto: CreateShippingStatusDto) {
    return this.shippingStatusRepo.create(dto);
  }

  update(id: string, dto: UpdateShippingStatusDto) {
    return this.shippingStatusRepo.update(id, dto);
  }

  delete(shippingId: string) {
    return this.shippingStatusRepo.delete(shippingId);
  }

  findByShippingId(shippingId: string) {
    return this.shippingStatusRepo.findByShippingId(shippingId);
  }
}
