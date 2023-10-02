import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@v2/users/constants';
import { AddImageUrlsDto } from './dto';
import { ProductImageModel } from './model';
import { ProductImageService } from './product-image.service';

@Controller(ApiApplication.PRODUCT_IMAGE.CONTROLLER)
export class ProductImageController {
  constructor(private readonly productImageService: ProductImageService) {}

  @Post(ApiApplication.PRODUCT_IMAGE.ADD)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  add(@Body() dto: AddImageUrlsDto): Promise<ProductImageModel[]> {
    return this.productImageService.addImageUrls(dto);
  }

  @Get(ApiApplication.PRODUCT_IMAGE.GET_PRODUCT_IMAGES)
  getProductImages(
    @Param('productId') productId: string,
  ): Promise<ProductImageModel[]> {
    return this.productImageService.getProductImages(productId);
  }
}
