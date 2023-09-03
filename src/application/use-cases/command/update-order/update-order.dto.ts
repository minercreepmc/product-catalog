import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import {
  OrderAddressValueObject,
  OrderIdValueObject,
  OrderStatusValueObject,
} from '@value-objects/order';

export class UpdateOrderCommand implements CommandBase {
  constructor(options: UpdateOrderCommand) {
    this.id = options.id;
    this.address = options.address;
    this.status = options.status;
  }
  id: OrderIdValueObject;
  address?: OrderAddressValueObject;
  status?: OrderStatusValueObject;

  validate?(): DomainExceptionBase[] {
    return [
      this.id.validate?.(),
      this.address?.validate?.(),
      this.status?.validate?.(),
    ].filter((e) => e) as DomainExceptionBase[];
  }
}

export class UpdateOrderResponseDto {
  id: string;
  address: string;
  status: string;

  constructor(options: UpdateOrderResponseDto) {
    this.address = options.address;
    this.status = options.status;
  }
}
