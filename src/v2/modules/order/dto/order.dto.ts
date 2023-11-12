import { PaginationParams } from '@common/dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../constants';
import { OrderModel } from '../model';

export class UpdateOrderDto {
  @IsString()
  @IsEnum(OrderStatus)
  status: string;
}

export class OrderGetAllDto extends PaginationParams {
  @IsString()
  @IsOptional()
  status? = 'PROCESSING';

  @IsString()
  @IsOptional()
  orderBy: keyof OrderModel = 'created_at';

  @IsString()
  @IsOptional()
  direction: 'asc' | 'desc' = 'desc';
}
