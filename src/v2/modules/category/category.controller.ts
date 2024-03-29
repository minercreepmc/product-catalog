import { ApiApplication, PaginationParams } from '@constants';
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
import { USERS_ROLE } from '@v2/users/constants';
import { CategoryService } from './category.service';
import { CategoryModel } from './model';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryIncludeProductCountRO } from './ro';

@Controller(ApiApplication.CATEGORY.CONTROLLER)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(ApiApplication.CATEGORY.CREATE)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  create(@Body() dto: CreateCategoryDto): Promise<CategoryModel> {
    return this.categoryService.create(dto);
  }

  @Put(ApiApplication.CATEGORY.UPDATE)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryModel> {
    return this.categoryService.update(id, dto);
  }

  @Get(ApiApplication.CATEGORY.GET_ONE)
  getOne(@Param('id') id: string): Promise<CategoryModel> {
    return this.categoryService.getOne(id);
  }

  @Get(ApiApplication.CATEGORY.GET_ALL)
  getAll(@Query() query: PaginationParams): Promise<CategoryModel[]> {
    return this.categoryService.getAll(query);
  }

  @Post(ApiApplication.CATEGORY.GET_ALL_WITH_PRODUCT_COUNT)
  getAllWithProductCount(): Promise<CategoryIncludeProductCountRO[]> {
    return this.categoryService.getAllWithProductCount();
  }

  @Delete(ApiApplication.CATEGORY.DELETE)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  delete(@Param('id') id: string): Promise<CategoryModel> {
    return this.categoryService.deleteOne(id);
  }
}
