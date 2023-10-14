import { GlobalEvents } from '@constants';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateShippingDto, UpdateShippingDto } from './dto';
import { ShippingCreatedEvent, ShippingDeletedEvent } from './event';
import { ShippingRepository } from './shipping.repository';

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

  async getOne(id: string) {
    return this.shippingRepository.findOne(id);
  }

  async getOneByOrderId(orderId: string) {
    return this.shippingRepository.findOneByOrderId(orderId);
  }

  async getAll() {
    return this.shippingRepository.findAll();
  }

  async getByShipper(shipperId: string) {
    return this.shippingRepository.findByShipper(shipperId);
  }
}
