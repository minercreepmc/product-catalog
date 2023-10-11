import { DATABASE_TABLE, SHIPPING_SCHEMA } from '@constants';
import { isExistDb } from '@youba/nestjs-dbvalidator';
import { IsString } from 'class-validator';

export class CreateShippingStatusDto {
  @IsString()
  status: string;
  @isExistDb({
    table: DATABASE_TABLE.SHIPPING,
    column: SHIPPING_SCHEMA.ID,
  })
  @IsString()
  shippingId: string;
}

export class UpdateShippingStatusDto {
  @IsString()
  status: string;
}

export class GetByShippingIdDto {
  @isExistDb({
    table: DATABASE_TABLE.SHIPPING,
    column: SHIPPING_SCHEMA.ID,
  })
  @IsString()
  shippingId: string;
}
