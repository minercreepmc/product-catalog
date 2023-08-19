import {
  v1ApiEndpoints,
  V1CreateCartHttpRequest,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1RegisterMemberHttpRequest,
  V1RegisterMemberHttpResponse,
  V1UpdateCartHttpRequest,
  V1UpdateCartHttpResponse,
} from '@api/http';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { UserDomainExceptions } from '@domain-exceptions/user';
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
  const createCartUrl = v1ApiEndpoints.createCart;
  const updateCartUrl = v1ApiEndpoints.updateCart;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const loginUrl = v1ApiEndpoints.logIn;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should not update a cart if cart, product did not exist or somehow cart item is the same', async () => {
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
      .set('Cookie', getCookieFromHeader(loginResponse.header))
      .expect(HttpStatus.CONFLICT);

    expect(res.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new CartDomainExceptions.DoesNotExist(),
        new ProductDomainExceptions.DoesNotExist(),
        new CartDomainExceptions.ItemMustBeUnique(),
      ]),
    );
  });

  it('Should update successfully', async () => {
    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Okeasdasd123123+',
    };

    const res1 = await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(registerMemberRequest)
      .set('Accept', 'application/json')
      .expect(HttpStatus.CREATED);

    const { id: userId } = res1.body as V1RegisterMemberHttpResponse;

    const loginRequest: V1RegisterMemberHttpRequest = {
      username: registerMemberRequest.username,
      password: registerMemberRequest.password,
    };

    const res2 = await request(app.getHttpServer())
      .post(loginUrl)
      .set('Accept', 'application/json')
      .send(loginRequest)
      .expect(HttpStatus.OK);

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 2,
    };

    const res3 = await request(app.getHttpServer())
      .post(createProductUrl)
      .send(createProductRequest)
      .set('Accept', 'application/json')
      .set('Cookie', getCookieFromHeader(res2.header))
      .expect(HttpStatus.CREATED);

    const { id: productId, price } = res3.body as V1CreateProductHttpResponse;

    const cartRequest: V1CreateCartHttpRequest = {
      userId,
    };

    const res4 = await request(app.getHttpServer())
      .post(createCartUrl)
      .send(cartRequest)
      .set('Accept', 'application/json')
      .set('Cookie', getCookieFromHeader(res2.header))
      .expect(HttpStatus.CREATED);

    const { id: cartId } = res4.body as V1CreateProductHttpResponse;

    const updateCartRequest1: V1UpdateCartHttpRequest = {
      items: [
        {
          productId,
          price,
          amount: 2,
        },
      ],
    };

    const res5 = await request(app.getHttpServer())
      .put(updateCartUrl.replace(':id', cartId))
      .set('Accept', 'application/json')
      .set('Cookie', getCookieFromHeader(res2.header))
      .send(updateCartRequest1);

    const cart = res5.body as V1UpdateCartHttpResponse;

    expect(cart.items[0].productId).toBe(productId);
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

    const res6 = await request(app.getHttpServer())
      .put(updateCartUrl.replace(':id', cartId))
      .set('Accept', 'application/json')
      .set('Cookie', getCookieFromHeader(res2.header))
      .send(updateCartRequest2);

    const cart2 = res6.body as V1UpdateCartHttpResponse;

    expect(cart2.items[0].productId).toBe(productId);
    expect(cart2.items[0].amount).toBe(updateCartRequest2.items[0].amount);
    expect(cart2.items[0].price).toBe(price);

    const updateCartRequest3: V1UpdateCartHttpRequest = {
      items: [],
    };

    const res7 = await request(app.getHttpServer())
      .put(updateCartUrl.replace(':id', cartId))
      .set('Accept', 'application/json')
      .set('Cookie', getCookieFromHeader(res2.header))
      .send(updateCartRequest3);

    const cart3 = res7.body as V1UpdateCartHttpResponse;
    expect(cart3.items.length).toBe(0);
  });

  // Add more test cases for other routes, if needed.
});
