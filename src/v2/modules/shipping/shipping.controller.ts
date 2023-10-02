import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import {
  CreateShippingDto,
  GetShippingByShipperDto,
  UpdateShippingDto,
} from './dto';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { UserRole } from '@v2/users/constants';
import { ApiApplication } from '@constants';
import { ShippingModel } from './model';
import { ShippingRO } from './ro';
import { RequestWithUser } from '@api/http';

@Controller(ApiApplication.SHIPPING.CONTROLLER)
@UseGuards(JwtGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post(ApiApplication.SHIPPING.CREATE)
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  async create(@Body() dto: CreateShippingDto): Promise<ShippingModel> {
    return this.shippingService.create(dto);
  }

  @Put(ApiApplication.SHIPPING.UPDATE)
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
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

  @Post(ApiApplication.SHIPPING.GET_BY_SHIPPER_ID)
  @UseGuards(RoleGuard(UserRole.SHIPPER, UserRole.SHIPPER))
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
}
