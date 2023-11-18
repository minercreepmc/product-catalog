import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GlobalEvents, RequestWithUser } from '@constants';
import { ShippingCreatedEvent, ShippingDeletedEvent } from './event';
import type {
  CreateShippingDto,
  ShippingGetAllDto,
  ShippingGetDetailDto,
  UpdateShippingDto,
} from './dto';
import { ShippingRepository } from './shipping.repository';
import { plainToInstance } from 'class-transformer';
import { ShippingGetAllRO, ShippingRO } from './ro';
import { BaseService } from '@base';
import { USERS_ROLE } from '@v2/users/constants';

@Injectable()
export class ShippingService extends BaseService {
  constructor(
    private shippingRepository: ShippingRepository,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async store(dto: CreateShippingDto) {
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

  async getAll(dto: ShippingGetAllDto, req: RequestWithUser) {
    const response = await this.shippingRepository.getAll(dto, req.user.id);
    return plainToInstance(ShippingGetAllRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getDetail(dto: ShippingGetDetailDto, req: RequestWithUser) {
    const shipperId =
      req.user.role === USERS_ROLE.SHIPPER ? req.user.id : undefined;
    const response = await this.shippingRepository.getDetail(dto, shipperId);
    return plainToInstance(ShippingRO, response, {
      excludeExtraneousValues: true,
    });
  }
}
