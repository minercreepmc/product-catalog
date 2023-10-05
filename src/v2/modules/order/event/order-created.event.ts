export class OrderCreatedEvent {
  cartId: string;
  constructor(dto: OrderCreatedEvent) {
    this.cartId = dto.cartId;
  }
}
