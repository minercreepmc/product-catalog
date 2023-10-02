import { ApiApplication } from '@constants';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto, UpdateCartItemDto } from './dtos';
import { CartItemModel } from './model';

@Controller(ApiApplication.CART_ITEM.CONTROLLER)
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}
  @Post(ApiApplication.CART_ITEM.CREATE)
  create(@Body() dto: CreateCartItemDto): Promise<CartItemModel> {
    return this.cartItemService.create(dto);
  }

  @Put(ApiApplication.CART_ITEM.UPDATE)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItemModel> {
    return this.cartItemService.update(id, dto);
  }

  @Delete(ApiApplication.CART_ITEM.DELETE)
  delete(@Param('id') id: string): Promise<CartItemModel> {
    return this.cartItemService.delete(id);
  }
}
