import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@v2/users/constants';
import type { PaginationParams } from '@constants';
import { ProductService } from './product.service';
import type { ProductModel } from './model';
import type {
  CreateProductDto,
  DeleteProductsDto,
  UpdateProductDto,
} from './dto';
import type {
  CreateProductRO,
  ProductWithImagesRO,
  ProductRO,
  UpdateProductRO,
} from './ro';

@Controller(ApiApplication.PRODUCT.CONTROLLER)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(ApiApplication.PRODUCT.CREATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  create(@Body() dto: CreateProductDto): Promise<CreateProductRO> {
    return this.productService.create(dto);
  }

  @Put(ApiApplication.PRODUCT.UPDATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<UpdateProductRO> {
    return this.productService.update(id, dto);
  }

  @Get(ApiApplication.PRODUCT.GET_ALL)
  getAll(@Query() params: PaginationParams): Promise<ProductRO[]> {
    return this.productService.getAll(params);
  }

  @Post(ApiApplication.PRODUCT.GET_ALL_WITH_IMAGES)
  getAllWithImages(
    @Query() params: PaginationParams,
  ): Promise<ProductWithImagesRO[]> {
    return this.productService.getAllWithImages(params);
  }

  @Get(ApiApplication.PRODUCT.GET_ONE)
  getOne(@Param('id') id: string): Promise<ProductRO> {
    return this.productService.getOne(id);
  }

  @Delete(ApiApplication.PRODUCT.DELETE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  deleteProduct(@Param('id') id: string): Promise<ProductModel> {
    return this.productService.deleteOneById(id);
  }

  @Post(ApiApplication.PRODUCT.DELETE_MANY)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  deleteProducts(@Body() dto: DeleteProductsDto): Promise<string[]> {
    return this.productService.deleteManyByIds(dto.ids);
  }

  @Post(ApiApplication.PRODUCT.GET_DAILY_SOLD)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  getSoldProductDaily() {
    return this.productService.getSoldProductDaily();
  }

  @Post(ApiApplication.PRODUCT.GET_MONTHLY_SOLD)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  getSoldProductMonthly() {
    return this.productService.getSoldProductMonthly();
  }

  @Post(ApiApplication.PRODUCT.GET_WEEKLY_SOLD)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  getSoldProductWeekly() {
    return this.productService.getSoldProductWeekly();
  }
}
