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
import { CreateProductDto, DeleteProducts, UpdateProductDto } from './dtos';
import { ProductService } from './product.service';

@Controller(ApiApplication.PRODUCT.CONTROLLER)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post(ApiApplication.PRODUCT.CREATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(ApiApplication.PRODUCT.UPDATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Get(ApiApplication.PRODUCT.GET_ALL)
  getAll(@Query() params: PaginationParams) {
    return this.productService.getAll(params);
  }

  @Get(ApiApplication.PRODUCT.GET_ONE)
  getOne(@Param('id') id: string) {
    return this.productService.getOne(id);
  }

  @Post()
  @Delete(ApiApplication.PRODUCT.DELETE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteOneById(id);
  }

  @Post(ApiApplication.PRODUCT.DELETE_MANY)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  deleteProducts(@Body() dto: DeleteProducts) {
    return this.productService.deleteManyByIds(dto.ids);
  }
}
