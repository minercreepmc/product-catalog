import { IsNumber, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}
