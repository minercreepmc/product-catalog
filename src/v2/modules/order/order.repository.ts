import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { DatabaseService } from '@config/database';
import { OrderStatus } from './constants';
import { DefaultCatch } from 'catch-decorator-ts';
import { CreateOrderRO, OrderDetailsRO, OrderItemRO, OrderRO } from './ro';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrderRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(memberId: string, dto: CreateOrderDto): Promise<CreateOrderRO> {
    const res = await this.databaseService.runQuery(
      `
        SELECT id FROM cart WHERE user_id = $1
      `,
      [memberId],
    );

    const cartId = res.rows[0].id;
    const totalPrice = await this.getTotalPrice(cartId);
    const orderDetails = await this.createOrderDetails(
      memberId,
      cartId,
      totalPrice,
      dto,
    );
    const order: CreateOrderRO = {
      ...orderDetails,
      itemIds: [],
    };

    order.itemIds = await this.createOrderItems(order.id, cartId);
    return { ...order, cartId };
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

    const orderDetails = plainToInstance(OrderRO, res.rows[0]);

    if (!orderDetails) {
      throw new NotFoundException('Order not found');
    }

    const order: OrderDetailsRO = {
      id: orderDetails.id,
      total_price: orderDetails.total_price,
      status: orderDetails.status,
      fee_price: orderDetails.fee_price,
      fee_name: orderDetails.fee_name,
      member_name: orderDetails.member_name,
      member_phone: orderDetails.member_phone,
      address_location: orderDetails.address_location,
      updated_at: orderDetails.updated_at,
      items: [],
    };

    order.items = await this.getOrderItems(order.id);
    return order;
  }

  async findByMember(memberId: string) {
    const res = await this.databaseService.runQuery(
      `
        SELECT o.updated_at, o.id, o.total_price, o.status, 
        a.location as address_location, f.name as fee_name,
        f.fee as fee_price
        FROM order_details o
        INNER JOIN address a ON a.id = o.address_id
        INNER JOIN shipping_fee f ON f.id = o.fee_id
        WHERE o.member_id = $1;
      `,
      [memberId],
    );

    return res.rows;
  }

  async findAll() {
    const res = await this.databaseService.runQuery(
      `
        SELECT o.updated_at, o.id, o.total_price, o.status, 
        a.location as address_location, f.name as fee_name,
        f.fee as fee_price, u.full_name as member_name, u.phone as member_phone
        FROM order_details o
        INNER JOIN address a ON a.id = o.address_id
        INNER JOIN shipping_fee f ON f.id = o.fee_id
        INNER JOIN users u ON u.id = o.member_id
      `,
    );

    return res.rows;
  }

  @DefaultCatch((err) => {
    console.log('Cannot get total price', err);
    throw err;
  })
  private async getTotalPrice(cartId: string) {
    const res = await this.databaseService.runQuery(
      `
      SELECT SUM(f.fee + (p.price - (p.price * COALESCE(d.percentage, 0) / 100)) * i.amount)
      FROM cart_item i
      INNER JOIN cart c ON c.id = $1
      INNER JOIN shipping_fee f ON c.shipping_fee_id = f.id
      INNER JOIN product p ON p.id = i.product_id
      LEFT JOIN discount d ON d.id = p.discount_id
      WHERE i.cart_id = $1;
    `,
      [cartId],
    );

    return res.rows[0].sum;
  }

  @DefaultCatch((err) => {
    console.log('Cannot create order details', err);
    throw err;
  })
  private async createOrderDetails(
    memberId: string,
    cartId: string,
    totalPrice: number,
    dto: CreateOrderDto,
  ) {
    const { addressId } = dto;

    const res = await this.databaseService.runQuery(
      `
      INSERT INTO order_details (status, member_id, address_id, total_price, fee_id) 
        VALUES ($1, $2, $3, $4, (SELECT shipping_fee_id FROM cart WHERE id = $5))
      RETURNING *; 
    `,
      [OrderStatus.PROCESSING, memberId, addressId, totalPrice, cartId],
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
