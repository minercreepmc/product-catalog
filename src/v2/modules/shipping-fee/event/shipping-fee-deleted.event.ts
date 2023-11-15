export class ShippingFeeDeletedEvent {
  userId: string;
  constructor(dto: ShippingFeeDeletedEvent) {
    this.userId = dto.userId;
  }
}
