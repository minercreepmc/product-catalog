import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateShippingDto, UpdateShippingDto } from './dto';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { UserRole } from '@v2/users/constants';
import { ApiApplication } from '@constants';
import { ShippingModel } from './model';
import { ShippingRO } from './ro';

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
}
