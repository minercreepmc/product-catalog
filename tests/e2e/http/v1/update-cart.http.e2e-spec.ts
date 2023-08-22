import {
  v1ApiEndpoints,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1RegisterMemberHttpRequest,
  V1UpdateCartHttpRequest,
  V1UpdateCartHttpResponse,
} from '@api/http';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  getCookieFromHeader,
  mapDomainExceptionsToObjects,
  randomString,
} from '@utils/functions';
import * as request from 'supertest';

describe('Update cart', () => {
  let app: INestApplication;
  const updateCartUrl = v1ApiEndpoints.updateCart;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const loginUrl = v1ApiEndpoints.logIn;
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

    cookie = getCookieFromHeader(loginResponse.header);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should not update a cart if cart, product did not exist or somehow cart item is the same', async () => {
    const updateCartRequest: V1UpdateCartHttpRequest = {
      items: [
        {
          productId: '12345',
          price: 2,
          amount: 2,
        },
        {
          productId: '12345',
          price: 2,
          amount: 2,
        },
      ],
    };
    const res = await request(app.getHttpServer())
      .put(updateCartUrl)
      .query({ id: '12345' })
      .send(updateCartRequest)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.CONFLICT);

    expect(res.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new ProductDomainExceptions.DoesNotExist(),
        new CartDomainExceptions.ItemMustBeUnique(),
      ]),
    );
  });

  it('Should update successfully', async () => {
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

    const {
      id: productId,
      price,
      name: productName,
    } = createProductRes.body as V1CreateProductHttpResponse;

    const updateCartRequest1: V1UpdateCartHttpRequest = {
      items: [
        {
          productId,
          price,
          amount: 2,
        },
      ],
    };

    const updateCartRes = await request(app.getHttpServer())
      .put(updateCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send(updateCartRequest1);

    const cart = updateCartRes.body as V1UpdateCartHttpResponse;

    expect(cart.items[0].name).toBe(productName);
    expect(cart.items[0].amount).toBe(updateCartRequest1.items[0].amount);
    expect(cart.items[0].price).toBe(price);

    const updateCartRequest2: V1UpdateCartHttpRequest = {
      items: [
        {
          productId,
          price,
          amount: 1,
        },
      ],
    };

    const updateCartRes2 = await request(app.getHttpServer())
      .put(updateCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send(updateCartRequest2);

    const cart2 = updateCartRes2.body as V1UpdateCartHttpResponse;

    expect(cart2.items[0].name).toBe(productName);
    expect(cart2.items[0].amount).toBe(updateCartRequest2.items[0].amount);
    expect(cart2.items[0].price).toBe(price);

    const updateCartRequest3: V1UpdateCartHttpRequest = {
      items: [],
    };

    const updateCartRes3 = await request(app.getHttpServer())
      .put(updateCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send(updateCartRequest3);

    const cart3 = updateCartRes3.body as V1UpdateCartHttpResponse;
    expect(cart3.items.length).toBe(0);
  });

  // Add more test cases for other routes, if needed.
});
