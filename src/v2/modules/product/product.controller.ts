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
import { CreateProductDto, DeleteProducts, UpdateProductDto } from './dto';
import { ProductModel } from './model';
import { ProductService } from './product.service';
import { CreateProductRO, GetAllProductRO, UpdateProductRO } from './ro';

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
  getAll(@Query() params: PaginationParams): Promise<GetAllProductRO[]> {
    return this.productService.getAll(params);
  }

  @Get(ApiApplication.PRODUCT.GET_ONE)
  getOne(@Param('id') id: string): Promise<ProductModel> {
    return this.productService.getOne(id);
  }

  @Post()
  @Delete(ApiApplication.PRODUCT.DELETE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  deleteProduct(@Param('id') id: string): Promise<ProductModel> {
    return this.productService.deleteOneById(id);
  }

  @Post(ApiApplication.PRODUCT.DELETE_MANY)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  deleteProducts(@Body() dto: DeleteProducts): Promise<string[]> {
    return this.productService.deleteManyByIds(dto.ids);
  }
}
