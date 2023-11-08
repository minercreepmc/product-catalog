import { ApiApplication, RequestWithUser } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@v2/users/constants';
import { CartItemService } from './cart-item.service';
import type {
  CreateCartItemDto,
  UpdateCartItemDto,
  UpsertCartItemDto,
} from './dtos';
import type { CartItemModel } from './model';
import type { CartItemRO } from './ro';

@Controller(ApiApplication.CART_ITEM.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(UserRole.MEMBER))
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}
  @Post(ApiApplication.CART_ITEM.CREATE)
  create(
    @Req() req: RequestWithUser,
    @Body() dto: CreateCartItemDto,
  ): Promise<CartItemModel> {
    return this.cartItemService.create(req.user.id, dto);
  }

  @Put(ApiApplication.CART_ITEM.UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemRO> {
    return this.cartItemService.update(id, dto);
  }

  @Post(ApiApplication.CART_ITEM.UPSERT)
  upsert(
    @Body() dto: UpsertCartItemDto,
    @Req() req: RequestWithUser,
  ): Promise<CartItemRO> {
    return this.cartItemService.upsert(req.user.id, dto);
  }

  @Delete(ApiApplication.CART_ITEM.DELETE)
  delete(@Param('id') id: string): Promise<CartItemModel> {
    return this.cartItemService.delete(id);
  }

  @Post(ApiApplication.CART_ITEM.GET_BY_USER_ID)
  getbyUserId(@Req() req: RequestWithUser): Promise<CartItemRO[]> {
    return this.cartItemService.getByUserId(req.user.id);
  }
}
