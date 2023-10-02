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
import { UpdateOrderDto, CreateOrderDto } from './dtos';
import { OrderService } from './order.service';

@Controller(ApiApplication.ORDER.CONTROLLER)
@UseGuards(JwtGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post(ApiApplication.ORDER.CREATE)
  @UseGuards(RoleGuard(UserRole.MEMBER))
  create(@Req() req: RequestWithUser, @Body() dto: CreateOrderDto) {
    return this.orderService.create(req.user.id, dto);
  }

  @Put(ApiApplication.ORDER.UPDATE)
  @UseGuards(RoleGuard(UserRole.STAFF))
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.orderService.update(id, dto);
  }

  @Get(ApiApplication.ORDER.GET_ONE)
  @UseGuards(RoleGuard(UserRole.MEMBER, UserRole.STAFF))
  get(@Param('orderId') id: string) {
    return this.orderService.getOne(id);
  }
}
