import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { DatabaseService } from '@config/database';
import { OrderStatus } from './constants';
import { DefaultCatch } from 'catch-decorator-ts';
import { CreateOrderRO, OrderItemRO, OrderRO } from './ro';

@Injectable()
export class OrderRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(memberId: string, dto: CreateOrderDto): Promise<CreateOrderRO> {
    const { cartId, shippingFeeId } = dto;
    const totalPrice = await this.getTotalPrice(cartId, shippingFeeId);
    const orderDetails = await this.createOrderDetails(
      memberId,
      totalPrice,
      dto,
    );
    const order: CreateOrderRO = {
      ...orderDetails,
      items: [],
    };

    order.items = await this.createOrderItems(order.id, cartId);
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const res = await this.databaseService.runQuery(
      `
        UPDATE order_details SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;
      `,
      [dto.status, id],
    );

    const order = res.rows[0];

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOneById(orderId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT o.updated_at, o.id, o.total_price, o.status, 
        a.location as address_location, f.name as fee_name,
        f.fee as fee_price
        FROM order_details o
        INNER JOIN address a ON a.id = o.address_id
        INNER JOIN shipping_fee f ON f.id = o.fee_id
        WHERE o.id = $1;
      `,
      [orderId],
    );

    const orderDetails = res.rows[0];

    if (!orderDetails) {
      throw new NotFoundException('Order not found');
    }

    const order: OrderRO = {
      id: orderDetails.id,
      total_price: orderDetails.total_price,
      status: orderDetails.status,
      fee_price: orderDetails.fee_price,
      fee_name: orderDetails.fee_name,
      address_location: orderDetails.address_location,
      updated_at: orderDetails.updated_at,
      items: [],
    };

    order.items = await this.getOrderItems(order.id);

    return order;
  }

  @DefaultCatch((err) => {
    console.log('Cannot get total price', err);
    throw err;
  })
  private async getTotalPrice(cartId: string, feeId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT SUM(f.fee + (p.price - (p.price * COALESCE(d.percentage, 0) / 100)) * i.amount)
      FROM cart_item i
      INNER JOIN shipping_fee f ON f.id = $2
      INNER JOIN product p ON p.id = i.product_id
      LEFT JOIN discount d ON d.id = p.discount_id
      WHERE i.cart_id = $1;
    `,
      [cartId, feeId],
    );

    return res.rows[0].sum;
  }

  @DefaultCatch((err) => {
    console.log('Cannot create order details', err);
    throw err;
  })
  private async createOrderDetails(
    memberId: string,
    totalPrice: number,
    dto: CreateOrderDto,
  ) {
    const { addressId, shippingFeeId } = dto;
    const res = await this.databaseService.runQuery(
      `
      INSERT INTO order_details (status, member_id, address_id, total_price, fee_id) 
        SELECT $1, $2, $3, $4, $5
      RETURNING *; 
    `,
      [OrderStatus.PROCESSING, memberId, addressId, totalPrice, shippingFeeId],
    );

    const orderDetails = res.rows[0];

    if (!orderDetails) {
      throw new Error('Cannot create order details');
    }

    return orderDetails;
  }

  @DefaultCatch((err) => {
    console.log('Cannot create order items', err);
    throw err;
  })
  private async createOrderItems(
    orderId: string,
    cartId: string,
  ): Promise<string[]> {
    const res = await this.databaseService.runQuery(
      `
        INSERT INTO order_item (order_id, price, amount, product_id)
          SELECT $1, p.price, i.amount, i.product_id 
          FROM cart_item i
          INNER JOIN product p ON p.id = i.product_id
          WHERE i.cart_id = $2
        RETURNING order_item.id;
      `,
      [orderId, cartId],
    );

    const orderItems = res.rows;

    if (orderItems.length === 0) {
      throw new Error('Cannot create order items');
    }

    return orderItems;
  }

  private async getOrderItems(orderId: string): Promise<OrderItemRO[]> {
    const res = await this.databaseService.runQuery(
      `
        SELECT i.price, i.amount, p.name, p.description, c.name as category_name
        FROM order_item i
        INNER JOIN product p ON p.id = i.product_id
        LEFT JOIN product_category pc ON pc.product_id = p.id
        LEFT JOIN category c ON c.id = pc.category_id
        WHERE i.order_id = $1;
      `,
      [orderId],
    );

    return res.rows;
  }
}
