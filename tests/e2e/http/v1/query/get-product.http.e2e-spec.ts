import {
  v1ApiEndpoints,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetProductHttpResponse,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get product', () => {
  let app: INestApplication;
  const getProductUrl = v1ApiEndpoints.getProduct;
  const createProductUrl = v1ApiEndpoints.createProduct;

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

  it('should get a product already created', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 12,
    };

    const createResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const createBody = createResponse.body as V1CreateProductHttpResponse;

    const response = await request(app.getHttpServer())
      .get(getProductUrl.replace(':id', createBody.id))
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const body: V1GetProductHttpResponse = response.body;

    expect(body.name).toBe(createBody.name);
  });

  // Add more test cases for other routes, if needed.
});
