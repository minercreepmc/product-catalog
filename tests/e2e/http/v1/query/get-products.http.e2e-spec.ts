import {
  v1ApiEndpoints,
  V1CreateProductHttpRequest,
  V1GetProductsHttpQuery,
  V1GetProductsHttpResponse,
} from '@api/http';
import {
  JwtAuthenticationGuard,
  MockAuthGuard,
} from '@application/application-services/auth';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomProductName,
  generateRandomProductPrice,
} from '@utils/functions';
import * as request from 'supertest';

describe('Get products', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const getProductsUrl = v1ApiEndpoints.getProducts;

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

  it('should get', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: generateRandomProductName(),
      price: generateRandomProductPrice(),
    };

    await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const getProductQuery: V1GetProductsHttpQuery = {
      limit: 1,
    };

    const response = await request(app.getHttpServer())
      .get(getProductsUrl)
      .query(getProductQuery)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const body: V1GetProductsHttpResponse = response.body;

    expect(body.products.length).toEqual(1);
  });

  // Add more test cases for other routes, if needed.
});
