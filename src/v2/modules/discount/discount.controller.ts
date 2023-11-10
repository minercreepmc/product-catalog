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
import { DiscountService } from './discount.service';
import { DiscountModel } from './model';
import { CreateDiscountDto, UpdateDiscountDto } from './dto';
import { DiscountIncludeProductCountRO, DiscountRO } from './ro';

@Controller(ApiApplication.DISCOUNT.CONTROLLER)
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}
  @Post(ApiApplication.DISCOUNT.CREATE)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  create(@Body() dto: CreateDiscountDto): Promise<DiscountModel> {
    return this.discountService.create(dto);
  }

  @Put(ApiApplication.DISCOUNT.UPDATE)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDiscountDto,
  ): Promise<DiscountModel> {
    return this.discountService.updateOneById(id, dto);
  }

  @Delete(ApiApplication.DISCOUNT.DELETE)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  deleteOneById(@Param('id') id: string): Promise<DiscountModel> {
    return this.discountService.deleteOneById(id);
  }

  @Get(ApiApplication.DISCOUNT.GET_ALL)
  getAll(@Query() params: PaginationParams): Promise<DiscountModel[]> {
    return this.discountService.getAll(params);
  }

  @Get(ApiApplication.DISCOUNT.GET_ONE)
  getOneById(@Param('id') id: string): Promise<DiscountRO> {
    return this.discountService.getOneById(id);
  }

  @Post(ApiApplication.DISCOUNT.GET_ALL_WITH_PRODUCT_COUNT)
  getAllWithProductCount(): Promise<DiscountIncludeProductCountRO[]> {
    return this.discountService.getAllWithProductCount();
  }
}
