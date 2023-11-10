import { ApiApplication, RequestWithUser } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
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
import { USERS_ROLE } from '@v2/users/constants';
import type {
  UpdateOrderDto,
  GetByMemberDto,
  OrderGetByMemberStatusQueryDto,
} from './dto';
import type { OrderModel } from './model';
import { OrderService } from './order.service';
import type { CreateOrderRO, OrderRO } from './ro';

@Controller(ApiApplication.ORDER.CONTROLLER)
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post(ApiApplication.ORDER.CREATE)
  @UseGuards(RoleGuard(USERS_ROLE.MEMBER))
  create(@Req() req: RequestWithUser): Promise<CreateOrderRO> {
    return this.orderService.create(req.user.id);
  }

  @Put(ApiApplication.ORDER.UPDATE)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF, USERS_ROLE.SHIPPER, USERS_ROLE.MEMBER))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderModel> {
    return this.orderService.update(id, dto);
  }

  @Get(ApiApplication.ORDER.GET_ONE)
  @UseGuards(RoleGuard(USERS_ROLE.MEMBER, USERS_ROLE.STAFF))
  get(@Param('orderId') id: string): Promise<OrderRO> {
    return this.orderService.getOne(id);
  }

  @Get(ApiApplication.ORDER.GET_ALL)
  @UseGuards(RoleGuard(USERS_ROLE.STAFF))
  getAll(): Promise<OrderRO[]> {
    return this.orderService.getAll();
  }

  @Post(ApiApplication.ORDER.GET_BY_MEMBER)
  @UseGuards(RoleGuard(USERS_ROLE.MEMBER, USERS_ROLE.STAFF))
  getByMember(
    @Req() req: RequestWithUser,
    @Body() dto: GetByMemberDto,
    @Query() query: OrderGetByMemberStatusQueryDto,
  ): Promise<OrderRO[]> {
    if (req.user) {
      return this.orderService.getByMember(req.user.id, query);
    } else {
      return this.orderService.getByMember(dto.memberId, query);
    }
  }

  @Post(ApiApplication.ORDER.COUNT_DAILY)
  @UseGuards(RoleGuard(USERS_ROLE.ADMIN))
  countDaily() {
    return this.orderService.countDaily();
  }

  @Post(ApiApplication.ORDER.COUNT_MONTHLY)
  @UseGuards(RoleGuard(USERS_ROLE.ADMIN))
  countMonthly() {
    return this.orderService.countMonthly();
  }

  @Post(ApiApplication.ORDER.COUNT_WEEKLY)
  @UseGuards(RoleGuard(USERS_ROLE.ADMIN))
  countWeekly() {
    return this.orderService.countWeekly();
  }
}
