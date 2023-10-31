export class OrderModel {
  id: string;
  status: string;
  total_price: number;
  fee_id: string;
  member_id: string;
  address_id: string;
}

export class OrderItemModel {
  id: string;
  price: number;
  order_id: string;
  product_id: string;
  amount: number;

  constructor(dto: OrderItemModel) {
    this.id = dto.id;
    this.price = dto.price;
    this.order_id = dto.order_id;
    this.product_id = dto.product_id;
    this.amount = dto.amount;
  }
}
