import { ValueObjectBase } from '@base/domain';
import { OrderDomainExceptions } from '@domain-exceptions/order';
import { IsDefined, IsEnum, IsNotEmpty, validateSync } from 'class-validator';

export enum OrderStatusEnum {
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class OrderStatusValueObject implements ValueObjectBase {
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderStatusEnum)
  readonly value: OrderStatusEnum;
  constructor(value: OrderStatusEnum) {
    this.value = value;
  }

  static processing() {
    return new OrderStatusValueObject(OrderStatusEnum.PROCESSING);
  }

  static shipping() {
    return new OrderStatusValueObject(OrderStatusEnum.SHIPPING);
  }

  static completed() {
    return new OrderStatusValueObject(OrderStatusEnum.COMPLETED);
  }

  static canceled() {
    return new OrderStatusValueObject(OrderStatusEnum.CANCELED);
  }

  validate?() {
    const exceptions = validateSync(this);

    if (exceptions.length > 0) {
      return new OrderDomainExceptions.StatusDoesNotValid();
    }
  }
}
