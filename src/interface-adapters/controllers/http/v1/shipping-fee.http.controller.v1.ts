import { CreateShippingFeeDto } from '@api/http/v1';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { RoleGuard } from '@application/application-services/auth/roles';
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
import { ShippingFeeService } from '@use-cases/command/shipping/shipping-fee.service';
import { UserRoleEnum } from '@value-objects/user';

@Controller('/api/v1/shipping-fee')
@UseGuards(
  JwtAuthenticationGuard,
  RoleGuard(UserRoleEnum.Staff, UserRoleEnum.Admin),
)
export class V1ShippingFeeHttpController {
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
  update(@Param('id') id: string, @Body() dto: CreateShippingFeeDto) {
    return this.shippingFeeService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.shippingFeeService.delete(id);
  }
}
