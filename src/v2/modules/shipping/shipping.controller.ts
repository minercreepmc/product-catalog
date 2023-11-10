import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { USERS_ROLE } from '@v2/users/constants';
import { ApiApplication, RequestWithUser } from '@constants';
import { ShippingService } from './shipping.service';
import type { ShippingModel } from './model';
import type {
  CreateShippingDto,
  GetShippingByOrderDto,
  GetShippingByShipperDto,
  UpdateShippingDto,
} from './dto';
import type { ShippingRO } from './ro';

@Controller(ApiApplication.SHIPPING.CONTROLLER)
@UseGuards(JwtGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post(ApiApplication.SHIPPING.CREATE)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  async create(@Body() dto: CreateShippingDto): Promise<ShippingModel> {
    return this.shippingService.create(dto);
  }

  @Put(ApiApplication.SHIPPING.UPDATE)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShippingDto,
  ): Promise<ShippingModel> {
    return this.shippingService.update(id, dto);
  }

  @Get(ApiApplication.SHIPPING.GET_ONE)
  async getOne(@Param('id') id: string): Promise<ShippingRO> {
    return this.shippingService.getOne(id);
  }

  @Post(ApiApplication.SHIPPING.GET_BY_ORDER_ID)
  async getOneByOrderId(
    @Body() dto: GetShippingByOrderDto,
  ): Promise<ShippingRO> {
    return this.shippingService.getOneByOrderId(dto.orderId);
  }

  @Get(ApiApplication.SHIPPING.GET_ALL)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  async getAll(): Promise<ShippingRO[]> {
    return this.shippingService.getAll();
  }

  @Post(ApiApplication.SHIPPING.GET_BY_SHIPPER_ID)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER, USERS_ROLE.SHIPPER))
  async getShippingByShipperId(
    @Req() req: RequestWithUser,
    @Body() dto: GetShippingByShipperDto,
  ): Promise<ShippingRO[]> {
    if (req.user) {
      return this.shippingService.getByShipper(req.user.id);
    } else {
      return this.shippingService.getByShipper(dto.shipperId);
    }
  }

  @Delete(ApiApplication.SHIPPING.DELETE_BY_ORDER)
  async delete(@Param('orderId') orderId: string): Promise<void> {
    return this.shippingService.deleteByOrderId(orderId);
  }
}
