import { ApiProperty } from '@nestjs/swagger';

export class V1CreateDiscountHttpRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  percentage: number;
}
