import { PaginationParams } from '@common/dto';
import { DATABASE_TABLE } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

const { NAME: ORDER_DETAILS_NAME, SCHEMA: ORDER_DETAILS_SCHEMA } =
  DATABASE_TABLE.ORDER_DETAILS;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;
const { NAME, SCHEMA } = DATABASE_TABLE.SHIPPING;

export class CreateShippingDto {
  @IsString()
  @isExistDb({
    table: ORDER_DETAILS_NAME,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  orderId: string;
  @IsString()
  @isExistDb({
    table: USER_NAME,
    column: USER_SCHEMA.ID,
  })
  shipperId: string;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;
}
export class UpdateShippingDto {
  @IsString()
  @isExistDb({
    table: USER_NAME,
    column: USER_SCHEMA.ID,
  })
  shipperId: string;

  @IsDateString()
  deletedAt?: Date;

  @IsDateString()
  dueDate: Date;
}

export class ShippingGetDetailDto {
  @isExistDb({
    table: NAME,
    column: SCHEMA.ID,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @isExistDb({
    table: ORDER_DETAILS_NAME,
    column: ORDER_DETAILS_SCHEMA.ID,
  })
  @IsString()
  @IsOptional()
  orderId?: string;
}

export class ShippingGetAllDto extends PaginationParams {}
