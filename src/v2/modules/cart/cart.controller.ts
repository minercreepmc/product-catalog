import { RequestWithUser } from '@api/http';
import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserRole } from '@v2/users/constants';
import { CartService } from './cart.service';

@Controller(ApiApplication.CART.CONTROLLER)
@UseGuards(JwtGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(ApiApplication.CART.CREATE)
  create(@Req() req: RequestWithUser) {
    return this.cartService.create(req.user.id);
  }

  @Get(ApiApplication.CART.GET)
  @UseGuards(RoleGuard(UserRole.MEMBER))
  getByUserId(@Req() req: RequestWithUser) {
    return this.cartService.getByUserId(req.user.id);
  }
}
