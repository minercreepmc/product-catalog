const prefix = '/api/v1';

export const v1ApiEndpoints = {
  createProduct: `${prefix}/products`,
  updateProduct: `${prefix}/products/:id`,
  removeProducts: `${prefix}/products/remove`,
  getProducts: `${prefix}/products`,
  getProduct: `${prefix}/products/:id`,
  createDiscount: `${prefix}/discount`,
  updateDiscount: `${prefix}/discount/:id`,
  removeDiscounts: `${prefix}/discount/remove`,
  createCategory: `${prefix}/categories`,
  updateCategory: `${prefix}/categories/:id`,
  removeCategories: `${prefix}/categories/remove`,
  getCategories: `${prefix}/categories`,
  getCategory: `${prefix}/categories/:id`,
  registerMember: `${prefix}/register`,
  createCart: `${prefix}/cart`,
  updateCart: `${prefix}/cart/:id`,
  logIn: `${prefix}/log-in`,
  logOut: `${prefix}/log-out`,
  getProfile: `${prefix}/profile`,
};
