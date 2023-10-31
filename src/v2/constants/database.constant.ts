export enum DATABASE_TABLE {
  SHIPPING = 'shipping',
  SHIPPING_FEE = 'shipping_fee',
  USERS = 'users',
  ADDRESS = 'address',
  PRODUCT = 'product',
  DISCOUNT = 'discount',
  CATEGORY = 'category',
  PRODUCT_IMAGE = 'product_image',
  PRODUCT_CATEGORY = 'product_category',
  CART = 'cart',
  CART_ITEM = 'cart_item',
  ORDER_DETAILS = 'order_details',
  ORDER_ITEM = 'order_item',
}

export enum PRODUCT_SCHEMA {
  ID = 'id',
  NAME = 'name',
  PRICE = 'price',
  DESCRIPTION = 'description',
  IMAGE_URL = 'image_url',
  DISCOUNT_ID = 'discount_id',
}

export enum ADDRESS_SCHEMA {
  ID = 'id',
  LOCATION = 'location',
  USER_ID = 'user_id',
}

export enum CART_SCHEMA {
  ID = 'id',
  USER_ID = 'user_id',
  TOTAL_PRICE = 'total_price',
}

export enum CART_ITEM_SCHEMA {
  ID = 'id',
  CART_ID = 'cart_id',
  PRODUCT_ID = 'product_id',
  AMOUNT = 'amount',
}

export enum CATEGORY_SCHEMA {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
}

export enum PRODUCT_CATEGORY_SCHEMA {
  ID = 'id',
  PRODUCT_ID = 'product_id',
  CATEGORY_ID = 'category_id',
}

export enum DISCOUNT_SCHEMA {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  PERCENTAGE = 'percentage',
  ACTIVE = 'active',
}

export enum SHIPPING_FEE_SCHEMA {
  ID = 'id',
  NAME = 'name',
  FEE = 'fee',
}

export enum USER_SCHEMA {
  ID = 'id',
  USERNAME = 'username',
  PASSWORD = 'password',
  FULL_NAME = 'full_name',
  ROLE = 'role',
  PHONE = 'phone',
  EMAIL = 'email',
}

export enum ORDER_DETAILS_SCHEMA {
  ID = 'id',
  MEMBER_ID = 'member_id',
  TOTAL_PRICE = 'total_price',
  STATUS = 'status',
  ADDRESS_ID = 'address_id',
  FEE_ID = 'fee_id',
}

export enum SHIPPING_SCHEMA {
  ID = 'id',
  STATUS = 'status',
  ORDER_ID = 'order_id',
  SHIPPER_ID = 'shipper_id',
}

export enum PRODUCT_IMAGE_SHEMA {
  ID = 'id',
  PRODUCT_ID = 'product_id',
  URL = 'url',
}

export enum ORDER_ITEM_SCHEMA {
  ID = 'id',
  ORDER_ID = 'order_id',
  PRODUCT_ID = 'product_id',
  AMOUNT = 'amount',
  PRICE = 'price',
}
