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
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Update cart', () => {
  let app: INestApplication;
  const createCartUrl = v1ApiEndpoints.createCart;
  const updateCartUrl = v1ApiEndpoints.updateCart;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const registerMember = v1ApiEndpoints.registerMember;

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

  it('Should not update a cart if user, cart, product did not exist or somehow cart item is the same', async () => {
    const updateCartRequest: V1UpdateCartHttpRequest = {
      userId: '12345',
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
      .expect(HttpStatus.CONFLICT);

    expect(res.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new UserDomainExceptions.CredentialDoesNotValid(),
        new CartDomainExceptions.DoesNotExist(),
        new ProductDomainExceptions.DoesNotExist(),
        new CartDomainExceptions.ItemMustBeUnique(),
      ]),
    );
  });

  it('Should update successfully', async () => {
    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Wtf123123123+++',
    };

    const res = await request(app.getHttpServer())
      .post(registerMember)
      .send(registerMemberRequest)
      .expect(HttpStatus.CREATED);

    const { id: userId } = res.body as V1RegisterMemberHttpResponse;

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 2,
    };

    const res2 = await request(app.getHttpServer())
      .post(createProductUrl)
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const { id: productId, price } = res2.body as V1CreateProductHttpResponse;

    const createCartRequest: V1CreateCartHttpRequest = {
      userId,
    };

    const res3 = await request(app.getHttpServer())
      .post(createCartUrl)
      .send(createCartRequest)
      .expect(HttpStatus.CREATED);

    const { id: cartId } = res3.body as V1CreateProductHttpResponse;

    const updateCartRequest: V1UpdateCartHttpRequest = {
      userId: userId,
      items: [
        {
          productId,
          price,
          amount: 2,
        },
      ],
    };

    const res4 = await request(app.getHttpServer())
      .put(updateCartUrl.replace(':id', cartId))
      .send(updateCartRequest);

    console.log(res4.body.message);
    console.log(userId);

    const cart = res4.body as V1UpdateCartHttpResponse;

    expect(cart.userId).toBe(userId);
    expect(cart.items[0].productId).toBe(productId);
    expect(cart.items[0].amount).toBe(updateCartRequest.items[0].amount);
    expect(cart.items[0].price).toBe(price);
  });

  // Add more test cases for other routes, if needed.
});
