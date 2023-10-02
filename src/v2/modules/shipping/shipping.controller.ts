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
import { CreateShippingDto, UpdateShippingDto } from './dtos';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { UserRole } from '@v2/users/constants';

@Controller('/api/shipping')
@UseGuards(JwtGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  async create(@Body() dto: CreateShippingDto) {
    return this.shippingService.create(dto);
  }

  @Put(':id')
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  async update(@Param('id') id: string, @Body() dto: UpdateShippingDto) {
    return this.shippingService.update(id, dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.shippingService.getOne(id);
  }
}
