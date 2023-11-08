import { HttpStatus } from '@nestjs/common';

export const GlobalErrors = {
  USER: {
    CREATE_FAILED: {
      code: 'USER.CREATE_FAILED',
      message: 'User create failed',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    UPDATE_FAILED: {
      code: 'USER.UPDATE_FAILED',
      message: 'User update failed',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    NOT_FOUND: {
      code: 'USER.NOT_FOUND',
      message: 'User not found',
      status: HttpStatus.NOT_FOUND,
    },
  },
  CART: {
    NOT_FOUND: {
      code: 'CART.NOT_FOUND',
      message: 'Cart not found',
      status: HttpStatus.NOT_FOUND,
    },
  },
  ORDER: {
    NOT_FOUND: {
      code: 'ORDER.NOT_FOUND',
      message: 'Order not found',
      status: HttpStatus.NOT_FOUND,
    },
  },
  SHIPPING_METHOD: {
    GET_ALL_FAILED: {
      code: 'SHIPPING_METHOD.GET_ALL_FAILED',
      message: 'Shipping method get all failed',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  },
};
