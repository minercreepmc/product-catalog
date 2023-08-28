import {
  v1ApiEndpoints,
  V1CreateOrderHttpRequest,
  V1CreateOrderHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1RegisterAdminHttpRequest,
  V1RegisterMemberHttpRequest,
} from '@api/http';
import { OrderDomainExceptions } from '@domain-exceptions/order';
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

describe('Create order', () => {
  let app: INestApplication;
  const createOrderUrl = v1ApiEndpoints.createOrder;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const registerAdminUrl = v1ApiEndpoints.registerAdmin;
  const loginAdminUrl = v1ApiEndpoints.logInAdmin;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const loginUrl = v1ApiEndpoints.logIn;
  let memberCookie: any;
  let adminCookie: any;
  const apiKey = process.env.API_KEY!;
  let productId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Orasdad12312+++',
    };

    await request(app.getHttpServer())
      .post(registerMemberUrl)
      .set('Accept', 'application/json')
      .send(registerMemberRequest)
      .expect(HttpStatus.CREATED);

    const loginResponse = await request(app.getHttpServer())
      .post(loginUrl)
      .set('Accept', 'application/json')
      .send(registerMemberRequest)
      .expect(HttpStatus.OK);

    const registerAdminRequest: V1RegisterAdminHttpRequest = {
      username: randomString(),
      password: 'Orasdad12312+++',
    };

    await request(app.getHttpServer())
      .post(registerAdminUrl)
      .send(registerAdminRequest)
      .set('Accept', 'application/json')
      .set('X-API-KEY', apiKey)
      .expect(HttpStatus.CREATED);

    const loginAdminResponse = await request(app.getHttpServer())
      .post(loginAdminUrl)
      .send(registerAdminRequest)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    memberCookie = getCookieFromHeader(loginResponse.header);
    adminCookie = getCookieFromHeader(loginAdminResponse.header);

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 5.99,
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .send(createProductRequest)
      .set('Accept', 'application/json')
      .set('Cookie', adminCookie)
      .expect(HttpStatus.CREATED);

    const createProductResponseBody =
      createProductResponse.body as V1CreateProductHttpResponse;

    productId = createProductResponseBody.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should not create a order if the request is invalid', async () => {
    const createOrderRequest: V1CreateOrderHttpRequest = {
      address: '',
      totalPrice: 0,
      productIds: [''],
    };

    const response = await request(app.getHttpServer())
      .post(createOrderUrl)
      .set('Accept', 'application/json')
      .send(createOrderRequest)
      .set('Cookie', memberCookie)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new OrderDomainExceptions.TotalPriceDoesNotValid(),
        new OrderDomainExceptions.AddressDoesNotValid(),
        new ProductDomainExceptions.IdDoesNotValid(),
      ]),
    );
  });

  it('Should create an order', async () => {
    const createOrderRequest: V1CreateOrderHttpRequest = {
      address: randomString(),
      totalPrice: 12,
      productIds: [productId],
    };

    const createOrderResponse = await request(app.getHttpServer())
      .post(createOrderUrl)
      .set('Accept', 'application/json')
      .send(createOrderRequest)
      .set('Cookie', memberCookie)
      .expect(HttpStatus.CREATED);

    const createOrderResponseBody =
      createOrderResponse.body as V1CreateOrderHttpResponse;

    expect(createOrderResponseBody.address).toBe(createOrderRequest.address);
    expect(createOrderResponseBody.totalPrice).toBe(
      createOrderRequest.totalPrice,
    );
    expect(createOrderResponseBody.productIds).toIncludeAllMembers([productId]);
  });

  // Add more test cases for other routes, if needed.
});
