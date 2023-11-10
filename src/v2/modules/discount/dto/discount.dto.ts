import { DATABASE_TABLE } from '@constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

const { NAME, SCHEMA } = DATABASE_TABLE.DISCOUNT;

export class CreateDiscountDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.NAME,
  })
  @IsString()
  @IsNotEmpty({
    message: 'Tên giảm giá không được để trống',
  })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty({
    message: 'Phầm trăm không được để trống',
  })
  percentage: number;
}

export class UpdateDiscountDto {
  @isUniqueDb({
    table: NAME,
    column: SCHEMA.NAME,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  percentage?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
