import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { UserRole } from '@v2/users/constants';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ShippingFeeService } from './shipping-fee.service';
import { CreateShippingFeeDto, UpdateShippingFeeDto } from './dto';
import { ApiApplication } from '@constants';
import { ShippingFeeModel } from './model';

@Controller(ApiApplication.SHIPPING_FEE.CONTROLLER)
@UseGuards(JwtGuard)
export class ShippingFeeController {
  constructor(private readonly shippingFeeService: ShippingFeeService) {}

  @Get(ApiApplication.SHIPPING_FEE.GET_ALL)
  getAll(): Promise<ShippingFeeModel[]> {
    return this.shippingFeeService.getAll();
  }

  @Get(ApiApplication.SHIPPING_FEE.GET_ONE)
  getOne(@Param('id') id: string): Promise<ShippingFeeModel> {
    return this.shippingFeeService.getOne(id);
  }

  @Post(ApiApplication.SHIPPING_FEE.CREATE)
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  create(@Body() dto: CreateShippingFeeDto): Promise<ShippingFeeModel> {
    return this.shippingFeeService.create(dto);
  }

  @Put(ApiApplication.SHIPPING_FEE.UPDATE)
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateShippingFeeDto,
  ): Promise<ShippingFeeModel> {
    return this.shippingFeeService.update(id, dto);
  }

  @Delete(ApiApplication.SHIPPING_FEE.DELETE)
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  delete(@Param('id') id: string): Promise<ShippingFeeModel> {
    return this.shippingFeeService.delete(id);
  }
}
