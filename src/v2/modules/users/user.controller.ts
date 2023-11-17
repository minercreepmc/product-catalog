import { JwtGuard } from '@guards/jwt';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '@guards/roles';
import { ApiApplication, RequestWithUser } from '@constants';
import { UserService } from './user.service';
import { UserModel } from './model';
import {
  CreateMemberDto,
  CreateShipperDto,
  CreateStaffDto,
  CreateAdminDto,
  UpdateUserDto,
  ShipperGetAllDto,
} from './dto';
import { ShipperGetAllRO, UserDataRO } from './ro';
import { USERS_ROLE } from './constants';

@Controller(ApiApplication.USER.CONTROLLER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(ApiApplication.USER.GET_ALL_USER)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.getAllUsers();
  }

  @Post(ApiApplication.USER.GET_ALL_STAFF)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  async getAllStaff(): Promise<UserDataRO[]> {
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
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  async createStaff(@Body() dto: CreateStaffDto): Promise<UserModel> {
    return this.userService.createStaff(dto);
  }

  @Post(ApiApplication.USER.CREATE_SHIPPER)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN, USERS_ROLE.STAFF))
  async createShipper(@Body() dto: CreateShipperDto): Promise<UserModel> {
    return this.userService.createShipper(dto);
  }

  @Get(ApiApplication.USER.GET_ALL_SHIPPER)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  getAllShippers(@Query() dto: ShipperGetAllDto): Promise<ShipperGetAllRO> {
    return this.userService.getAllShippers(dto);
  }

  @Get(ApiApplication.USER.GET_ONE)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.ADMIN))
  getOne(@Param('id') id: string): Promise<UserDataRO> {
    return this.userService.getOne(id);
  }

  @Put(ApiApplication.USER.UPDATE)
  @UseGuards(
    JwtGuard,
    RoleGuard(
      USERS_ROLE.STAFF,
      USERS_ROLE.ADMIN,
      USERS_ROLE.SHIPPER,
      USERS_ROLE.MEMBER,
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
      USERS_ROLE.STAFF,
      USERS_ROLE.ADMIN,
      USERS_ROLE.SHIPPER,
      USERS_ROLE.MEMBER,
    ),
  )
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.userService.update(req.user.id, dto);
  }

  @Post(ApiApplication.USER.COUNT_DAILY_MEMBER)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  countDailyMember() {
    return this.userService.countDailyMember();
  }

  @Post(ApiApplication.USER.COUNT_MONTHLY_MEMBER)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  countMonthlyMember() {
    return this.userService.countMonthlyMember();
  }

  @Post(ApiApplication.USER.COUNT_WEEKLY_MEMBER)
  @UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
  countWeeklyMember() {
    return this.userService.countWeeklyMember();
  }
}
