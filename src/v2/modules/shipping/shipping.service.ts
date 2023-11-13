import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GlobalEvents } from '@constants';
import { ShippingCreatedEvent, ShippingDeletedEvent } from './event';
import type {
  CreateShippingDto,
  ShippingGetDetailDto,
  UpdateShippingDto,
} from './dto';
import { ShippingRepository } from './shipping.repository';
import { plainToInstance } from 'class-transformer';
import { ShippingGetAllRO, ShippingGetDetailRO } from './ro';

@Injectable()
export class ShippingService {
  constructor(
    private shippingRepository: ShippingRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateShippingDto) {
    const created = await this.shippingRepository.create(dto);

    this.eventEmitter.emit(
      GlobalEvents.SHIPPING.CREATED,
      new ShippingCreatedEvent({
        orderId: created.order_id,
      }),
    );

    return created;
  }

  async deleteByOrderId(orderId: string) {
    const deleted = await this.shippingRepository.deleteByOrderId(orderId);

    this.eventEmitter.emit(
      GlobalEvents.SHIPPING.DELETED,
      new ShippingDeletedEvent({
        orderId: deleted.order_id,
        status: deleted.status,
      }),
    );

    return deleted;
  }

  async update(id: string, dto: UpdateShippingDto) {
    return this.shippingRepository.update(id, dto);
  }

  async getAll() {
    const response = await this.shippingRepository.getAll();
    return plainToInstance(
      ShippingGetAllRO,
      { data: response },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getDetail(dto: ShippingGetDetailDto) {
    const response = await this.shippingRepository.getDetail(dto);
    return plainToInstance(ShippingGetDetailRO, response, {
      excludeExtraneousValues: true,
    });
  }
}
