import { RequestWithUser } from '@api/http';
import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
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
import { UserRole } from '@v2/users/constants';
import { UpdateOrderDto, CreateOrderDto, GetByMemberDto } from './dto';
import { OrderModel } from './model';
import { OrderService } from './order.service';
import { CreateOrderRO, OrderRO } from './ro';

@Controller(ApiApplication.ORDER.CONTROLLER)
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post(ApiApplication.ORDER.CREATE)
  @UseGuards(RoleGuard(UserRole.MEMBER))
  create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateOrderDto,
  ): Promise<CreateOrderRO> {
    return this.orderService.create(req.user.id, dto);
  }

  @Put(ApiApplication.ORDER.UPDATE)
  @UseGuards(RoleGuard(UserRole.STAFF, UserRole.SHIPPER))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderModel> {
    return this.orderService.update(id, dto);
  }

  @Get(ApiApplication.ORDER.GET_ONE)
  @UseGuards(RoleGuard(UserRole.MEMBER, UserRole.STAFF))
  get(@Param('orderId') id: string): Promise<OrderRO> {
    return this.orderService.getOne(id);
  }

  @Get(ApiApplication.ORDER.GET_ALL)
  @UseGuards(RoleGuard(UserRole.STAFF))
  getAll(): Promise<OrderRO[]> {
    return this.orderService.getAll();
  }

  @Post(ApiApplication.ORDER.GET_BY_MEMBER)
  @UseGuards(RoleGuard(UserRole.MEMBER, UserRole.STAFF))
  getByMember(
    @Req() req: RequestWithUser,
    @Body() dto: GetByMemberDto,
  ): Promise<OrderRO[]> {
    if (req.user) {
      return this.orderService.getByMember(req.user.id);
    } else {
      return this.orderService.getByMember(dto.memberId);
    }
  }
}
