import { CreateShippingDto, UpdateShippingDto } from '@api/http/v1';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { RoleGuard, Roles } from '@application/application-services/auth/roles';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from '@use-cases/command/shipping';
import { UserRoleEnum } from '@value-objects/user';

@Controller('/api/v1/shipping')
@UseGuards(JwtAuthenticationGuard)
export class V1ShippingHttpController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @UseGuards(RoleGuard(UserRoleEnum.Staff, UserRoleEnum.Admin))
  async create(@Body() dto: CreateShippingDto) {
    return this.shippingService.create(dto);
  }

  @Put(':id')
  @UseGuards(RoleGuard(UserRoleEnum.Staff, UserRoleEnum.Admin))
  async update(@Param('id') id: string, @Body() dto: UpdateShippingDto) {
    return this.shippingService.update(id, dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.shippingService.getOne(id);
  }
}
