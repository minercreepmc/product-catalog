import { DatabaseService } from '@config/database';
import { ApiApplication } from '@constants';
import { Get, Injectable } from '@nestjs/common';
import { OrderStatus } from '@v2/order/constants';

@Injectable()
export class IncomeRepository {
  constructor(private databaseService: DatabaseService) {}

  async getIncomeDaily() {
    const res = await this.databaseService.runQuery(
      `
      SELECT SUM(total_price) as total_price 
      FROM order_details
      WHERE status = $1
        AND date_trunc('day', updated_at) = date_trunc('day', current_date)
    `,
      [OrderStatus.COMPLETED],
    );

    return res.rows[0].total_price || 0;
  }

  @Get(ApiApplication.INCOME.GET_MONTHLY)
  async getIncomeMonthly() {
    const res = await this.databaseService.runQuery(
      `
    SELECT COALESCE(SUM(total_price), 0) as total_price 
    FROM "order_details"
    WHERE status = $1
    AND date_trunc('month', updated_at) = date_trunc('month', current_date)
    `,
      [OrderStatus.COMPLETED],
    );

    return res.rows[0].total_price || 0;
  }

  @Get(ApiApplication.INCOME.GET_WEEKLY)
  async getIncomeWeekly() {
    const res = await this.databaseService.runQuery(
      `
    SELECT COALESCE(SUM(total_price), 0) as total_price 
    FROM "order_details"
    WHERE status = $1
    AND date_trunc('week', updated_at) = date_trunc('week', current_date)
    `,
      [OrderStatus.COMPLETED],
    );

    return res.rows[0].total_price || 0;
  }
  @Get(ApiApplication.INCOME.GET_YEARLY)
  async getIncomeYearly() {
    const res = await this.databaseService.runQuery(
      `
    SELECT COALESCE(SUM(total_price), 0) as total_price 
    FROM "order_details"
    WHERE status = $1
    AND date_trunc('year', updated_at) = date_trunc('year', current_date)
    `,
      [OrderStatus.COMPLETED],
    );

    return res.rows[0].total_price || 0;
  }
}
