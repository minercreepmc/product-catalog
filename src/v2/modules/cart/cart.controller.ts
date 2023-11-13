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
import { USERS_ROLE } from '@v2/users/constants';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto';
import { CartGetByUserIdRO, CartUpdateRO } from './ro';
import { ResultRO } from '@common/ro';

@Controller(ApiApplication.CART.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(USERS_ROLE.MEMBER))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(ApiApplication.CART.CREATE)
  create(@Req() req: RequestWithUser): Promise<ResultRO> {
    return this.cartService.create(req.user.id);
  }

  @Put(ApiApplication.CART.UPDATE)
  update(
    @Req() req: RequestWithUser,
    @Body() dto: UpdateCartDto,
  ): Promise<CartUpdateRO> {
    return this.cartService.update(req.user.id, dto);
  }

  @Get(ApiApplication.CART.GET)
  @UseGuards(RoleGuard(USERS_ROLE.MEMBER))
  getByUserId(@Req() req: RequestWithUser): Promise<CartGetByUserIdRO> {
    return this.cartService.getByUserId(req.user.id);
  }
}
