import { ResultRO } from '@common/ro';
import { ApiApplication, RequestWithUser } from '@constants';
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
import { USERS_ROLE } from '@v2/users/constants';
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { AddressCreateRO, AddressGetAllRO, AddressUpdateRO } from './ro';

@Controller(ApiApplication.ADDRESS.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(USERS_ROLE.MEMBER))
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  @Post(ApiApplication.ADDRESS.CREATE)
  create(
    @Body() dto: CreateAddressDto,
    @Req() req: RequestWithUser,
  ): Promise<AddressCreateRO> {
    return this.addressService.store(req.user.id, dto);
  }

  @Get(ApiApplication.ADDRESS.GET_ALL)
  getAll(@Req() req: RequestWithUser): Promise<AddressGetAllRO> {
    return this.addressService.getAll(req.user.id);
  }

  @Delete(ApiApplication.ADDRESS.DELETE)
  delete(@Param('id') id: string): Promise<ResultRO> {
    return this.addressService.delete(id);
  }

  @Put(ApiApplication.ADDRESS.UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ): Promise<AddressUpdateRO> {
    return this.addressService.update(id, dto);
  }
}
