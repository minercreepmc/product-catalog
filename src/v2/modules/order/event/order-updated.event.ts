export class OrderUpdatedEvent {
  orderId: string;
  status: string;
  constructor(dto: OrderUpdatedEvent) {
    this.orderId = dto.orderId;
    this.status = dto.status;
  }
}
