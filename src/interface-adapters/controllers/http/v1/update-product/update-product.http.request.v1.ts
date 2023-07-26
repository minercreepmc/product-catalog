import { ApiProperty } from '@nestjs/swagger';

export class V1UpdateProductHttpRequest {
  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  image?: Express.Multer.File;

  @ApiProperty({ required: false })
  discountId?: string;
}
