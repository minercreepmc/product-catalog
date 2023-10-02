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
import { UserRole } from '@v2/users/constants';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';

@Controller(ApiApplication.CATEGORY.CONTROLLER)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post(ApiApplication.CATEGORY.CREATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put(ApiApplication.CATEGORY.UPDATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Get(ApiApplication.CATEGORY.GET_ONE)
  getOne(@Param('id') id: string) {
    return this.categoryService.getOne(id);
  }

  @Get(ApiApplication.CATEGORY.GET_ALL)
  getAll(@Query() query: PaginationParams) {
    return this.categoryService.getAll(query);
  }

  @Delete(ApiApplication.CATEGORY.DELETE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  delete(@Param('id') id: string) {
    return this.categoryService.deleteOne(id);
  }
}
