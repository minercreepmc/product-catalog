import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { USERS_ROLE } from '@v2/users/constants';
import { ApiApplication, RequestWithUser } from '@constants';
import { ShippingService } from './shipping.service';
import { ShippingModel } from './model';
import {
  CreateShippingDto,
  ShippingGetAllDto,
  ShippingGetDetailDto,
  UpdateShippingDto,
} from './dto';
import { ShippingGetAllRO, ShippingGetDetailRO } from './ro';

@Controller(ApiApplication.SHIPPING.CONTROLLER)
@UseGuards(JwtGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post(ApiApplication.SHIPPING.CREATE)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  async create(@Body() dto: CreateShippingDto): Promise<ShippingModel> {
    return this.shippingService.store(dto);
  }

  @Put(ApiApplication.SHIPPING.UPDATE)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShippingDto,
  ): Promise<ShippingModel> {
    return this.shippingService.update(id, dto);
  }

  @Get(ApiApplication.SHIPPING.GET_ALL)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER, USERS_ROLE.STAFF))
  async getAll(
    @Query() dto: ShippingGetAllDto,
    @Req() req: RequestWithUser,
  ): Promise<ShippingGetAllRO> {
    return this.shippingService.getAll(dto, req);
  }

  @Post(ApiApplication.SHIPPING.GET_DETAIL)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER, USERS_ROLE.STAFF))
  async getDetail(
    @Req() req: RequestWithUser,
    @Body() dto: ShippingGetDetailDto,
  ): Promise<ShippingGetDetailRO> {
    return this.shippingService.getDetail(dto, req);
  }

  @Delete(ApiApplication.SHIPPING.DELETE_BY_ORDER)
  async delete(@Param('orderId') orderId: string): Promise<void> {
    return this.shippingService.deleteByOrderId(orderId);
  }
}
