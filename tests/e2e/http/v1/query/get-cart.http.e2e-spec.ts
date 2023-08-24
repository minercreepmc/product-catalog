import {
  v1ApiEndpoints,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetCartHttpResponse,
  V1RegisterMemberHttpRequest,
  V1UpdateCartHttpRequest,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { getCookieFromHeader, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get cart', () => {
  let app: INestApplication;
  const getCartUrl = v1ApiEndpoints.getCart;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const loginUrl = v1ApiEndpoints.logIn;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const updateCartUrl = v1ApiEndpoints.updateCart;
  let cookie: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Okeasdasd123123+',
    };

    await request(app.getHttpServer())
      .post(registerMemberUrl)
      .set('Accept', 'application/json')
      .send(registerMemberRequest)
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

    cookie = getCookieFromHeader(loginResponse.header);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should get an empty cart when register an account', async () => {
    const getCartResponse = await request(app.getHttpServer())
      .get(getCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    const body = getCartResponse.body as V1GetCartHttpResponse;

    expect(body.items.length).toBe(0);
  });

  it('Should get a cart with items', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 2,
    };

    const createProductRes = await request(app.getHttpServer())
      .post(createProductUrl)
      .send(createProductRequest)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.CREATED);

    const { id: productId, price } =
      createProductRes.body as V1CreateProductHttpResponse;

    const getCartResponse = await request(app.getHttpServer())
      .get(getCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    const { id: cartId } = getCartResponse.body as V1GetCartHttpResponse;

    const updateCartRequest1: V1UpdateCartHttpRequest = {
      items: [
        {
          productId,
          price,
          amount: 2,
          cartId,
        },
      ],
    };

    await request(app.getHttpServer())
      .put(updateCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send(updateCartRequest1);

    const getCartRes = await request(app.getHttpServer())
      .get(getCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    const cart = getCartRes.body as V1GetCartHttpResponse;

    expect(cart.items[0]?.product?.id).toBe(productId);
    expect(cart.items[0].amount).toBe(updateCartRequest1.items[0].amount);
    expect(cart.total_price).toBe(updateCartRequest1.items[0].amount * price);
  });

  // Add more test cases for other routes, if needed.
});
