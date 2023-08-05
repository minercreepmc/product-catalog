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

  @ApiProperty({ required: false })
  categoryIds?: string[];
}

export class V1UpdateProductHttpResponse {
  id: string;
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
  discountId?: string;
  message?: string;

  constructor(options: Omit<V1UpdateProductHttpResponse, 'message'>) {
    const { id, name, price, description, imageUrl, discountId } = options;
    this.id = id;
    if (name) {
      this.name = name;
    }

    if (price) {
      this.price = price;
    }

    if (description) {
      this.description = description;
    }

    if (imageUrl) {
      this.imageUrl = imageUrl;
    }

    if (discountId) {
      this.discountId = discountId;
    }

    this.message = 'Product updated successfully';
  }
}
