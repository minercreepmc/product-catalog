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
import { DiscountService } from './discount.service';
import { CreateDiscountDto, UpdateDiscountDto } from './dtos';

@Controller(ApiApplication.DISCOUNT.CONTROLLER)
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}
  @Post(ApiApplication.DISCOUNT.CREATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  create(@Body() dto: CreateDiscountDto) {
    return this.discountService.create(dto);
  }

  @Put(ApiApplication.DISCOUNT.UPDATE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    return this.discountService.updateOneById(id, dto);
  }

  @Delete(ApiApplication.DISCOUNT.DELETE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  deleteOneById(@Param('id') id: string) {
    return this.discountService.deleteOneById(id);
  }

  @Get(ApiApplication.DISCOUNT.GET_ALL)
  getAll(@Query() params: PaginationParams) {
    return this.discountService.getAll(params);
  }

  @Get(ApiApplication.DISCOUNT.GET_ONE)
  getOneById(@Param('id') id: string) {
    return this.discountService.getOneById(id);
  }
}
