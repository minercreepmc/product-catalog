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
import { ShippingModel } from './model';
import {
  CreateShippingDto,
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

  @Get(ApiApplication.SHIPPING.GET_ALL)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  async getAll(): Promise<ShippingGetAllRO> {
    return this.shippingService.getAll();
  }

  @Post(ApiApplication.SHIPPING.GET_DETAIL)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER))
  async getDetail(
    @Req() req: RequestWithUser,
    @Body() dto: ShippingGetDetailDto,
  ): Promise<ShippingGetDetailRO> {
    return this.shippingService.getDetail({
      ...dto,
      shipperId: req.user.id,
    });
  }

  @Delete(ApiApplication.SHIPPING.DELETE_BY_ORDER)
  async delete(@Param('orderId') orderId: string): Promise<void> {
    return this.shippingService.deleteByOrderId(orderId);
  }
}
