import {
  v1ApiEndpoints,
  V1CreateOrderHttpRequest,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetCartHttpResponse,
  V1GetOrdersHttpResponse,
  V1RegisterAdminHttpRequest,
  V1RegisterMemberHttpRequest,
  V1UpdateCartHttpRequest,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { getCookieFromHeader, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get orders', () => {
  let app: INestApplication;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const registerAdminUrl = v1ApiEndpoints.registerAdmin;
  const loginUrl = v1ApiEndpoints.logIn;
  const loginAdminUrl = v1ApiEndpoints.logInAdmin;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const updateCartUrl = v1ApiEndpoints.updateCart;
  const createOrderUrl = v1ApiEndpoints.createOrder;
  const getOrdersUrl = v1ApiEndpoints.getOrders;
  const getCartUrl = v1ApiEndpoints.getCart;

  const apiKey = process.env.API_KEY!;

  let memberCookie: any;
  let adminCookie: any;
  let product: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Member
    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Okeasdasd123123+',
    };

    await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(registerMemberRequest)
      .set('Accept', 'application/json')
      .expect(HttpStatus.CREATED);

    const loginRequest: V1RegisterMemberHttpRequest = {
      username: registerMemberRequest.username,
      password: registerMemberRequest.password,
    };

    const loginResponse = await request(app.getHttpServer())
      .post(loginUrl)
      .set('Accept', 'application/json')
      .send(loginRequest)
      .expect(HttpStatus.OK);

    memberCookie = getCookieFromHeader(loginResponse.header);

    // Admin
    const registerAdminRequest: V1RegisterAdminHttpRequest = {
      username: randomString(),
      password: 'Password123+',
    };

    await request(app.getHttpServer())
      .post(registerAdminUrl)
      .send(registerAdminRequest)
      .set('X-API-Key', apiKey)
      .expect(HttpStatus.CREATED);

    const logInAdminResponse = await request(app.getHttpServer())
      .post(loginAdminUrl)
      .send(registerAdminRequest)
      .set('Accept', 'application/json')
      .set('X-API-Key', apiKey)
      .expect(HttpStatus.OK);

    adminCookie = getCookieFromHeader(logInAdminResponse.header);

    //Product
    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 12,
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .set('Cookie', adminCookie)
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    product = createProductResponse.body as V1CreateProductHttpResponse;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should work', async () => {
    const getCartResponse = await request(app.getHttpServer())
      .get(getCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', memberCookie)
      .expect(HttpStatus.OK);

    const { id: cartId } = getCartResponse.body as V1GetCartHttpResponse;

    const updateCartRequest: V1UpdateCartHttpRequest = {
      items: [
        {
          productId: product.id,
          price: product.price,
          amount: 2,
          cartId,
        },
      ],
    };

    await request(app.getHttpServer())
      .put(updateCartUrl.replace(':id', cartId))
      .set('Accept', 'application/json')
      .set('Cookie', memberCookie)
      .send(updateCartRequest)
      .expect(HttpStatus.OK);

    const createOrderRequest: V1CreateOrderHttpRequest = {
      address: randomString(),
      totalPrice: product.price * 2,
      productIds: [product.id],
    };

    const createOrderResponse = await request(app.getHttpServer())
      .post(createOrderUrl)
      .set('Accept', 'application/json')
      .set('Cookie', memberCookie)
      .send(createOrderRequest)
      .expect(HttpStatus.CREATED);

    const getOrdersResponse = await request(app.getHttpServer())
      .get(getOrdersUrl)
      .set('Accept', 'application/json')
      .set('Cookie', memberCookie)
      .expect(HttpStatus.OK);

    const getOrdersBody = getOrdersResponse.body as V1GetOrdersHttpResponse;

    expect(getOrdersBody.orders[0].id).toBe(createOrderResponse.body.id);
    expect(getOrdersBody.orders[0].address).toBe(createOrderRequest.address);
    expect(getOrdersBody.orders[0].total_price).toBe(
      createOrderRequest.totalPrice,
    );
    expect(getOrdersBody.orders[0].product_ids).toIncludeAllMembers([product.id]);
  });

  // Add more test cases for other routes, if needed.
});
