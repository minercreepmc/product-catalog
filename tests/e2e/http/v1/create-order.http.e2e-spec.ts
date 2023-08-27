import {
  v1ApiEndpoints,
  V1CreateOrderHttpRequest,
  V1CreateOrderHttpResponse,
  V1RegisterMemberHttpRequest,
} from '@api/http';
import { OrderDomainExceptions } from '@domain-exceptions/order';
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

    cookie = getCookieFromHeader(loginResponse.header);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should not create a order if the request is invalid', async () => {
    const createOrderRequest: V1CreateOrderHttpRequest = {
      address: '',
      totalPrice: 0,
    };

    const response = await request(app.getHttpServer())
      .post(createOrderUrl)
      .set('Accept', 'application/json')
      .send(createOrderRequest)
      .set('Cookie', cookie)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new OrderDomainExceptions.TotalPriceDoesNotValid(),
        new OrderDomainExceptions.AddressDoesNotValid(),
      ]),
    );
  });

  it('Should create an order', async () => {
    const createOrderRequest: V1CreateOrderHttpRequest = {
      address: randomString(),
      totalPrice: 12,
    };

    const createOrderResponse = await request(app.getHttpServer())
      .post(createOrderUrl)
      .set('Accept', 'application/json')
      .send(createOrderRequest)
      .set('Cookie', cookie)
      .expect(HttpStatus.CREATED);

    const createOrderResponseBody =
      createOrderResponse.body as V1CreateOrderHttpResponse;

    expect(createOrderResponseBody.address).toBe(createOrderRequest.address);
    expect(createOrderResponseBody.totalPrice).toBe(
      createOrderRequest.totalPrice,
    );
  });

  // Add more test cases for other routes, if needed.
});
