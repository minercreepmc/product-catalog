export class OrderModel {
  id: string;
  status: string;
  total_price: number;
  fee_id: string;
  address_id: string;

  constructor(dto: OrderModel) {
    this.id = dto.id;
    this.status = dto.status;
    this.total_price = dto.total_price;
    this.fee_id = dto.fee_id;
    this.address_id = dto.address_id;
  }
}

export class OrderModelJointed {
  id: string;
  status: string;
  total_price: number;
  fee_name: string;
  fee_price: number;
  address_location: string;
  updated_at: Date;

  constructor(dto: OrderModelJointed) {
    this.id = dto.id;
    this.status = dto.status;
    this.total_price = dto.total_price;
    this.fee_name = dto.fee_name;
    this.fee_price = dto.fee_price;
    this.address_location = dto.address_location;
    this.updated_at = dto.updated_at;
  }
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
