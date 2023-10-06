import { PaginationParams } from '@constants';
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
import { CreateProductDto, DeleteProductsDto, UpdateProductDto } from './dto';
import { ProductModel } from './model';
import { ProductService } from './product.service';
import {
  CreateProductRO,
  GetAllProductWithImagesRO,
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
  getAll(
    @Query() params: PaginationParams,
  ): Promise<GetAllProductWithImagesRO[]> {
    return this.productService.getAll(params);
  }

  @Post(ApiApplication.PRODUCT.GET_ALL_WITH_IMAGES)
  getAllWithImages(
    @Query() params: PaginationParams,
  ): Promise<GetAllProductWithImagesRO[]> {
    return this.productService.getAllWithImages(params);
  }

  @Get(ApiApplication.PRODUCT.GET_ONE)
  getOne(@Param('id') id: string): Promise<ProductModel> {
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
}
