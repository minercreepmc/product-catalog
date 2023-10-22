import { JwtGuard } from '@guards/jwt';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from './constants';
import { RoleGuard } from '@guards/roles';
import {
  CreateMemberDto,
  CreateShipperDto,
  CreateStaffDto,
  CreateAdminDto,
  UpdateUserDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiApplication, RequestWithUser } from '@constants';
import { UserModel } from './model';
import { UserRO } from './ro';

@Controller(ApiApplication.USER.CONTROLLER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(ApiApplication.USER.GET_ALL_USER)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.getAllUsers();
  }

  @Post(ApiApplication.USER.GET_ALL_STAFF)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  async getAllStaff(): Promise<UserRO[]> {
    return this.userService.getAllStaff();
  }

  @Post(ApiApplication.USER.CREATE_MEMBER)
  async createMember(@Body() dto: CreateMemberDto): Promise<UserModel> {
    return this.userService.createMember(dto);
  }

  @Post(ApiApplication.USER.CREATE_ADMIN)
  @UseGuards(AuthGuard('api-key'))
  async createAdmin(@Body() dto: CreateAdminDto): Promise<UserModel> {
    return this.userService.createAdmin(dto);
  }

  @Post(ApiApplication.USER.CREATE_STAFF)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
  async createStaff(@Body() dto: CreateStaffDto): Promise<UserModel> {
    return this.userService.createStaff(dto);
  }

  @Post(ApiApplication.USER.CREATE_SHIPPER)
  @UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN, UserRole.STAFF))
  async createShipper(@Body() dto: CreateShipperDto): Promise<UserModel> {
    return this.userService.createShipper(dto);
  }

  @Get(ApiApplication.USER.GET_ALL_SHIPPER)
  @UseGuards(JwtGuard, RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  getAllShippers(): Promise<UserModel[]> {
    return this.userService.getAllShippers();
  }

  @Get(ApiApplication.USER.GET_ONE)
  @UseGuards(JwtGuard, RoleGuard(UserRole.STAFF, UserRole.ADMIN))
  getOne(@Param('id') id: string): Promise<UserRO> {
    return this.userService.getOne(id);
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
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.userService.update(id, dto);
  }

  @Post(ApiApplication.USER.UPDATE_PROFILE)
  @UseGuards(
    JwtGuard,
    RoleGuard(
      UserRole.STAFF,
      UserRole.ADMIN,
      UserRole.SHIPPER,
      UserRole.MEMBER,
    ),
  )
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.userService.update(req.user.id, dto);
  }
}
