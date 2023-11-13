import { HttpStatus } from '@nestjs/common';

export const GlobalErrors = {
  USER: {
    CREATE_FAILED: {
      code: 'USER.CREATE_FAILED',
      message: 'Tạo người dùng thất bại',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    UPDATE_FAILED: {
      code: 'USER.UPDATE_FAILED',
      message: 'Cập nhật người dùng thất bại',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    NOT_FOUND: {
      code: 'USER.NOT_FOUND',
      message: 'Không tìm thấy người dùng',
      status: HttpStatus.NOT_FOUND,
    },
  },
  CART: {
    NOT_FOUND: {
      code: 'CART.NOT_FOUND',
      message: 'Không tìm thấy giỏ hàng',
      status: HttpStatus.NOT_FOUND,
    },
  },
  ORDER: {
    NOT_FOUND: {
      code: 'ORDER.NOT_FOUND',
      message: 'Không tìm thấy đơn hàng',
      status: HttpStatus.NOT_FOUND,
    },
  },
  SHIPPING_METHOD: {
    GET_ALL_FAILED: {
      code: 'SHIPPING_METHOD.GET_ALL_FAILED',
      message: 'Lấy danh sách phương thức giao hàng thất bại',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  },
  SHIPPING_FEE: {
    STORE_FAILED: {
      code: 'SHIPPING_FEE.STORE_FAILED',
      message: 'Lưu phí đơn hàng thất bại',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    UPDATE_FAILED: {
      code: 'SHIPPING_FEE.UPDATE_FAILED',
      message: 'Cập nhật phí đơn hàng thất bại',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    NAME_ALREADY_EXISTS: {
      code: 'SHIPPING_FEE.NAME_ALREADY_EXISTS',
      message: 'Tên phí đơn hàng đã tồn tại',
      status: HttpStatus.BAD_REQUEST,
    },
    IS_NOT_EXIST: {
      code: 'SHIPPING_FEE.IS_NOT_EXIST',
      message: 'Phí đơn hàng không tồn tại',
      status: HttpStatus.BAD_REQUEST,
    },
  },
  ADDRESS: {
    IS_NOT_EXIST: {
      code: 'ADDRESS.IS_NOT_EXIST',
      message: 'Địa chỉ không tồn tại',
      status: HttpStatus.BAD_REQUEST,
    },
    LOCATION_ALREADY_EXISTS: {
      code: 'ADDRESS.LOCATION_ALREADY_EXISTS',
      message: 'Tên địa chỉ đã tồn tại',
      status: HttpStatus.BAD_REQUEST,
    },
  },
};
