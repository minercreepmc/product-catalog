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
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto';
import { CartModel } from './model';
import { CartRO } from './ro';

@Controller(ApiApplication.CART.CONTROLLER)
@UseGuards(JwtGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(ApiApplication.CART.CREATE)
  create(@Req() req: RequestWithUser): Promise<CartModel> {
    return this.cartService.create(req.user.id);
  }

  @Put(ApiApplication.CART.UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateCartDto) {
    return this.cartService.update(id, dto);
  }

  @Get(ApiApplication.CART.GET)
  @UseGuards(RoleGuard(UserRole.MEMBER))
  getByUserId(@Req() req: RequestWithUser): Promise<CartRO> {
    return this.cartService.getByUserId(req.user.id);
  }
}
