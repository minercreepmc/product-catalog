import { DiscountSchema } from '@database/repositories/pg/discount';

export class DiscountModel implements DiscountSchema {
  id: string;
  name: string;
  description?: string;
  percentage: number;
  active: boolean;
}
