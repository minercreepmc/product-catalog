import {
  v1ApiEndpoints,
  V1CreateOrderHttpRequest,
  V1CreateOrderHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetBestSellingHttpQuery,
  V1GetBestSellingHttpResponse,
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

describe('Get best selling', () => {
  let app: INestApplication;
  const createOrderUrl = v1ApiEndpoints.createOrder;
  const updateOrderUrl = v1ApiEndpoints.updateOrder;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const registerAdminUrl = v1ApiEndpoints.registerAdmin;
  const loginAdminUrl = v1ApiEndpoints.logInAdmin;
  const loginUrl = v1ApiEndpoints.logIn;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const getBestSellingUrl = v1ApiEndpoints.getBestSelling;
  let memberCookie: any;
  let adminCookie: any;
  const apiKey = process.env.API_KEY!;
  let product: any;

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

    const registerAdminRequest: V1RegisterMemberHttpRequest = {
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
      .set('X-API-KEY', apiKey)
      .expect(HttpStatus.OK);

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 5.99,
    };

    memberCookie = getCookieFromHeader(loginResponse.header);
    adminCookie = getCookieFromHeader(loginAdminResponse.header);

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .send(createProductRequest)
      .set('Accept', 'application/json')
      .set('X-API-KEY', apiKey)
      .set('Cookie', adminCookie)
      .expect(HttpStatus.CREATED);

    product = createProductResponse.body as V1CreateProductHttpResponse;
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
      .set('Cookie', memberCookie)
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
      productIds: [product.id],
    };

    const createOrderResponse = await request(app.getHttpServer())
      .post(createOrderUrl)
      .send(createOrderRequest)
      .set('Accept', 'application/json')
      .set('Cookie', memberCookie)
      .expect(HttpStatus.CREATED);

    const createOrderResponseBody =
      createOrderResponse.body as V1CreateOrderHttpResponse;

    expect(createOrderResponseBody.address).toBe(createOrderRequest.address);
    expect(createOrderResponseBody.totalPrice).toBe(
      createOrderRequest.totalPrice,
    );

    const updateOrderRequest: V1UpdateOrderHttpRequest = {
      status: OrderStatusEnum.COMPLETED,
      address: randomString(),
    };

    const updateOrderResponse = await request(app.getHttpServer())
      .put(updateOrderUrl.replace(':id', createOrderResponseBody.id))
      .send(updateOrderRequest)
      .set('Accept', 'application/json')
      .set('Cookie', memberCookie)
      .expect(HttpStatus.OK);

    const updateOrderResponseBody =
      updateOrderResponse.body as V1UpdateOrderHttpResponse;

    expect(updateOrderResponseBody.status).toBe(updateOrderRequest.status);
    expect(updateOrderResponseBody.address).toBe(updateOrderRequest.address);

    // should increase sold count if "COMPLETE"

    const getBestSellingQuery: V1GetBestSellingHttpQuery = {
      limit: 1,
    };

    const getBestSellingResponse = await request(app.getHttpServer())
      .get(getBestSellingUrl)
      .query(getBestSellingQuery)
      .set('Accept', 'application/json')
      .set('Cookie', memberCookie)
      .expect(HttpStatus.OK);

    const { products } =
      getBestSellingResponse.body as V1GetBestSellingHttpResponse;

    expect(products.length).toBe(1);
    expect(products[0].sold).toBe(1);
  });

  // Add more test cases for other routes, if needed.
});
