import { RequestWithUser } from '@api/http';
import { CreateAddressDto, UpdateAddressDto } from '@api/http/v1';
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from '@use-cases/command/address';
import { UserRoleEnum } from '@value-objects/user';

@Controller('/api/v1/user/address')
@UseGuards(JwtAuthenticationGuard, RoleGuard(UserRoleEnum.Member))
export class V1AddressHttpController {
  constructor(private readonly addressService: AddressService) {}
  @Post()
  create(@Body() dto: CreateAddressDto, @Req() req: RequestWithUser) {
    return this.addressService.create(req.user.id, dto);
  }

  @Get()
  getAll(@Req() req: RequestWithUser) {
    return this.addressService.getAll(req.user.id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.addressService.delete(id);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, dto);
  }
}
