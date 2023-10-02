import { CreateShippingStatusDto } from '@api/http/v1/shipping-status.http.dto.v1';
import { ShippingStatusRepository } from '@database/repositories/pg/shipping-status/shipping-status.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingStatusService {
  constructor(private readonly shippingStatusRepo: ShippingStatusRepository) {}
  create(dto: CreateShippingStatusDto) {
    return this.shippingStatusRepo.create(dto);
  }

  // update(id: string, dto: UpdateShippingStatusDto) {
  //   return this.shippingStatusRepo.update(id, dto);
  // }

  delete(shippingId: string) {
    return this.shippingStatusRepo.delete(shippingId);
  }

  findAllByShippingId(shippingId: string) {
    return this.shippingStatusRepo.findAllByShippingId(shippingId);
  }
}
