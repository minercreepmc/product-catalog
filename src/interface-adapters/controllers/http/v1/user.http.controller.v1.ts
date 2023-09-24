import { CreateStaffDto, UpdateUserDto } from '@api/http';
import { JwtAuthenticationGuard } from '@application/application-services/auth';
import { RoleGuard } from '@application/application-services/auth/roles';
import { UserRepository } from '@database/repositories/pg/user';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { randomString } from '@utils/functions';
import { UserRoleEnum } from '@value-objects/user';
import * as bcrypt from 'bcrypt';

@Controller('/api/v1/user')
@UseGuards(JwtAuthenticationGuard)
export class V1UserHttpController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get('shipper')
  @UseGuards(RoleGuard(UserRoleEnum.Staff, UserRoleEnum.Admin))
  getAllShippers() {
    return this.userRepository.findAllByRole(UserRoleEnum.Shipper);
  }

  @Get(':id')
  @UseGuards(RoleGuard(UserRoleEnum.Staff, UserRoleEnum.Admin))
  getOne(@Param('id') id: string) {
    return this.userRepository.findOneById(id);
  }

  @Post('staff')
  @UseGuards(RoleGuard(UserRoleEnum.Admin))
  async createStaff(@Body() dto: CreateStaffDto) {
    const { username, fullName, password } = dto;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      id: randomString(),
      role: UserRoleEnum.Staff,
      username,
      full_name: fullName ? fullName : undefined,
      hashed,
    });

    user!.hashed = undefined;
    return user;
  }

  @Post('shipper')
  @UseGuards(RoleGuard(UserRoleEnum.Staff, UserRoleEnum.Admin))
  async createShipper(@Body() dto: CreateStaffDto) {
    const { username, fullName, password } = dto;
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      id: randomString(),
      role: UserRoleEnum.Shipper,
      username,
      full_name: fullName ? fullName : undefined,
      hashed,
    });

    user!.hashed = undefined;
    return user;
  }

  @Put(':id')
  @UseGuards(
    RoleGuard(
      UserRoleEnum.Staff,
      UserRoleEnum.Admin,
      UserRoleEnum.Shipper,
      UserRoleEnum.Member,
    ),
  )
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const { fullName, password } = dto;
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;

    const user = await this.userRepository.updateOneById(id, {
      fullName,
      password: hashed,
    });

    user!.hashed = undefined;
    return user;
  }
}
