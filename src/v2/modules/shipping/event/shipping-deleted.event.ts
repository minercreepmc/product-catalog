export class ShippingDeletedEvent {
  constructor(dto: ShippingDeletedEvent) {
    this.orderId = dto.orderId;
    this.status = dto.status;
  }

  orderId: string;
  status: string;
}
