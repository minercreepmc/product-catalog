import { IsEnum, IsString } from 'class-validator';
import { OrderStatus } from '../constants';

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: string;
}
