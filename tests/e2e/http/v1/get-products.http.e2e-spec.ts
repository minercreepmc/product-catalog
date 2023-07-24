import { V1CreateProductHttpRequest } from '@controllers/http/v1';
import { v1ApiEndpoints } from '@controllers/http/v1/endpoint.v1';
import {
  V1GetProductsHttpQuery,
  V1GetProductsHttpResponse,
} from '@controllers/http/v1/get-products';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomProductName,
  generateRandomProductPrice,
} from '@utils/functions';
import * as request from 'supertest';

describe('V1GetProductsHttpController (e2e)', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const getProductsUrl = v1ApiEndpoints.getProducts;

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

  it('should get something if it not empty', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: generateRandomProductName(),
      price: generateRandomProductPrice(),
    };

    await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .get(getProductsUrl)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const body: V1GetProductsHttpResponse = response.body;

    expect(body.products.length).toBeGreaterThan(0);
  });

  it('should get fields with limit', async () => {
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
