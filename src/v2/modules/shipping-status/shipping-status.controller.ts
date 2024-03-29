import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { USERS_ROLE } from '@v2/users/constants';
import { ShippingStatusService } from './shipping-status.service';
import {
  CreateShippingStatusDto,
  GetByOrderIdDto,
  GetByShippingIdDto,
  UpdateShippingStatusDto,
} from './dto';

@Controller(ApiApplication.SHIPPING_STATUS.CONTROLLER)
@UseGuards(JwtGuard)
export class ShippingStatusController {
  constructor(private shippingStatusService: ShippingStatusService) {}

  @Post(ApiApplication.SHIPPING_STATUS.CREATE)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER))
  create(@Body() dto: CreateShippingStatusDto) {
    return this.shippingStatusService.create(dto);
  }

  @Put(ApiApplication.SHIPPING_STATUS.UPDATE)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER))
  update(@Param('id') id: string, @Body() dto: UpdateShippingStatusDto) {
    return this.shippingStatusService.update(id, dto);
  }

  @Delete(ApiApplication.SHIPPING_STATUS.DELETE)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER))
  delete(@Param('id') id: string) {
    return this.shippingStatusService.delete(id);
  }

  @Post(ApiApplication.SHIPPING_STATUS.GET_BY_SHIPPING_ID)
  @UseGuards(RoleGuard(USERS_ROLE.SHIPPER, USERS_ROLE.STAFF))
  getByShippingId(@Body() dto: GetByShippingIdDto) {
    return this.shippingStatusService.findByShippingId(dto.shippingId);
  }

  @Post(ApiApplication.SHIPPING_STATUS.GET_BY_ORDER_ID)
  @UseGuards(RoleGuard(USERS_ROLE.MEMBER))
  getByOrderId(@Body() dto: GetByOrderIdDto) {
    return this.shippingStatusService.findByOrderId(dto.orderId);
  }
}
