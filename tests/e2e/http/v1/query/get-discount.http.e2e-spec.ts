import {
  v1ApiEndpoints,
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
  V1GetDiscountHttpQuery,
  V1GetDiscountHttpResponse,
} from '@api/http';
import {
  JwtAuthenticationGuard,
  MockAuthGuard,
} from '@application/application-services/auth';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get discount', () => {
  let app: INestApplication;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;
  const getDiscountUrl = v1ApiEndpoints.getDiscount;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should get', async () => {
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 2,
      description: randomString(),
    };

    const response = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const {
      name,
      description,
      percentage,
      id: discountId,
    }: V1CreateDiscountHttpResponse = response.body;

    expect(name).toBe(createDiscountRequest.name);
    expect(description).toBe(createDiscountRequest.description);
    expect(percentage).toBe(createDiscountRequest.percentage);

    const getDiscountRequest: V1GetDiscountHttpQuery = {};

    const getDiscountResponse = await request(app.getHttpServer())
      .get(getDiscountUrl.replace(':id', discountId))
      .query(getDiscountRequest)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const getDiscountBody =
      getDiscountResponse.body as V1GetDiscountHttpResponse;

    expect(getDiscountBody.name).toBe(createDiscountRequest.name);
    expect(getDiscountBody.description).toBe(createDiscountRequest.description);
    expect(getDiscountBody.percentage).toBe(createDiscountRequest.percentage);
  });

  // Add more test cases for other routes, if needed.
});
