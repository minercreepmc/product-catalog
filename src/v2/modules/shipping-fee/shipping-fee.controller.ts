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
import { CreateShippingFeeDto, UpdateShippingFeeDto } from './dtos';

@Controller('/api/shipping-fee')
@UseGuards(JwtGuard, RoleGuard(UserRole.STAFF, UserRole.ADMIN))
export class ShippingFeeController {
  constructor(private readonly shippingFeeService: ShippingFeeService) {}

  @Get()
  getAll() {
    return this.shippingFeeService.getAll();
  }
  @Post()
  create(@Body() dto: CreateShippingFeeDto) {
    return this.shippingFeeService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateShippingFeeDto) {
    return this.shippingFeeService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.shippingFeeService.delete(id);
  }
}
