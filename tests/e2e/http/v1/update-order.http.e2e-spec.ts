import {
  v1ApiEndpoints,
  V1CreateOrderHttpRequest,
  V1CreateOrderHttpResponse,
  V1GetCartHttpResponse,
  V1RegisterMemberHttpRequest,
  V1UpdateOrderHttpRequest,
  V1UpdateOrderHttpResponse,
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
import { OrderStatusEnum } from '@value-objects/order';
import * as request from 'supertest';

describe('Update order', () => {
  let app: INestApplication;
  const createOrderUrl = v1ApiEndpoints.createOrder;
  const updateOrderUrl = v1ApiEndpoints.updateOrder;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const loginUrl = v1ApiEndpoints.logIn;
  const getCartUrl = v1ApiEndpoints.getCart;
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

  it('Should not update an order if the request is invalid', async () => {
    const updateOrderRequest: V1UpdateOrderHttpRequest = {
      status: '' as unknown as OrderStatusEnum,
      address: '',
    };

    const response = await request(app.getHttpServer())
      .put(updateOrderUrl.replace(':id', randomString()))
      .set('Accept', 'application/json')
      .send(updateOrderRequest)
      .set('Cookie', cookie)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new OrderDomainExceptions.StatusDoesNotValid(),
        new OrderDomainExceptions.AddressDoesNotValid(),
      ]),
    );
  });

  it('Should update an order', async () => {
    const createOrderRequest: V1CreateOrderHttpRequest = {
      address: randomString(),
      totalPrice: 100,
    };

    const createOrderResponse = await request(app.getHttpServer())
      .post(createOrderUrl)
      .send(createOrderRequest)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.CREATED);

    const createOrderResponseBody =
      createOrderResponse.body as V1CreateOrderHttpResponse;

    expect(createOrderResponseBody.address).toBe(createOrderRequest.address);
    expect(createOrderResponseBody.totalPrice).toBe(
      createOrderRequest.totalPrice,
    );

    const updateOrderRequest: V1UpdateOrderHttpRequest = {
      status: OrderStatusEnum.SHIPPING,
      address: randomString(),
    };

    const updateOrderResponse = await request(app.getHttpServer())
      .put(updateOrderUrl.replace(':id', createOrderResponseBody.id))
      .send(updateOrderRequest)
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .expect(HttpStatus.OK);

    const updateOrderResponseBody =
      updateOrderResponse.body as V1UpdateOrderHttpResponse;

    expect(updateOrderResponseBody.status).toBe(updateOrderRequest.status);
    expect(updateOrderResponseBody.address).toBe(updateOrderRequest.address);
  });

  // Add more test cases for other routes, if needed.
});
