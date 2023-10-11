export class ShippingCreatedEvent {
  constructor(dto: ShippingCreatedEvent) {
    this.orderId = dto.orderId;
  }

  orderId: string;
}
