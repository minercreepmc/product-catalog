import { RequestWithUser } from '@api/http';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
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
import { UserRole } from '@v2/users/constants';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dtos';

@Controller('/api/address')
@UseGuards(JwtGuard, RoleGuard(UserRole.MEMBER))
export class AddressController {
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
