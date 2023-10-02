import { RequestWithUser, UpdateUserDto } from '@api/http';
import { JwtGuard } from '@guards/jwt';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from './constants';
import { RoleGuard } from '@guards/roles';
import {
  CreateMemberDto,
  CreateShipperDto,
  CreateStaffDto,
  CreateAdminDto,
} from './dtos';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiApplication } from '@constants';

@Controller(ApiApplication.USER.CONTROLLER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(ApiApplication.USER.GET_ALL_USER)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post(ApiApplication.USER.CREATE_MEMBER)
  async createMember(@Body() dto: CreateMemberDto) {
    return this.userService.createMember(dto);
  }

  @Post(ApiApplication.USER.CREATE_ADMIN)
  @UseGuards(AuthGuard('api-key'))
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.userService.createAdmin(dto);
  }

  @Post(ApiApplication.USER.CREATE_STAFF)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  async createStaff(@Body() dto: CreateStaffDto) {
    return this.userService.createStaff(dto);
  }

  @Get(ApiApplication.USER.GET_ALL_SHIPPER)
  @UseGuards(JwtGuard, RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  getAllShippers() {
    return this.userService.getAllShippers();
  }

  @Get(ApiApplication.USER.GET_ONE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  getOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }

  @Post(ApiApplication.USER.GET_ALL_SHIPPER)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN, UserRole.STAFF))
  async createShipper(@Body() dto: CreateShipperDto) {
    return this.userService.createShipper(dto);
  }

  @Put(ApiApplication.USER.UPDATE)
  @UseGuards(
    JwtGuard,
    RoleGuard(
      UserRole.STAFF,
      UserRole.ADMIN,
      UserRole.SHIPPER,
      UserRole.MEMBER,
    ),
  )
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
}
