import { ApiApplication, RequestWithUser } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@v2/users/constants';
import type { CartService } from './cart.service';
import type { CartModel } from './model';
import type { UpdateCartDto } from './dto';
import type { CartRO } from './ro';

@Controller(ApiApplication.CART.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(UserRole.MEMBER))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(ApiApplication.CART.CREATE)
  create(@Req() req: RequestWithUser): Promise<CartModel> {
    return this.cartService.create(req.user.id);
  }

  @Put(ApiApplication.CART.UPDATE)
  update(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateCartDto,
  ): Promise<CartModel> {
    return this.cartService.update(req.user.id, dto);
  }

  @Get(ApiApplication.CART.GET)
  @UseGuards(RoleGuard(UserRole.MEMBER))
  getByUserId(@Req() req: RequestWithUser): Promise<CartRO> {
    return this.cartService.getByUserId(req.user.id);
  }
}
