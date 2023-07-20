import { V1CreateProductHttpRequest } from '@controllers/http/v1';
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
  const productsUrl = `products`;
  const getProductUrl = 'get';
  const createProductUrl = 'create';
  const apiPrefix = `api/v1`;

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

  describe(`${productsUrl}/${getProductUrl} (GET)`, () => {
    it('should get something if it not empty', async () => {
      const createProductRequest: V1CreateProductHttpRequest = {
        name: generateRandomProductName(),
        price: {
          amount: generateRandomProductPrice(),
          currency: 'USD',
        },
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${createProductUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${getProductUrl}`)
        .set('Accept', 'application/json')
        .send({})
        .expect(HttpStatus.OK);

      const body: V1GetProductsHttpResponse = response.body;

      expect(body.products.length).toBeGreaterThan(0);
    });

    it('should get specified field', async () => {
      const createProductRequest: V1CreateProductHttpRequest = {
        name: generateRandomProductName(),
        price: {
          amount: generateRandomProductPrice(),
          currency: 'USD',
        },
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${createProductUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CREATED);

      const getProductRequest: V1GetProductsHttpQuery = {
        fields: ['price', 'name'],
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${getProductUrl}`)
        .set('Accept', 'application/json')
        .send(getProductRequest)
        .expect(HttpStatus.OK);

      const body: V1GetProductsHttpResponse = response.body;

      expect(body.products[0].name).toBeDefined();
      expect(body.products[0].price).toBeDefined();
    });

    it('limit and offset', async () => {
      const createProductRequest: V1CreateProductHttpRequest = {
        name: generateRandomProductName(),
        price: {
          amount: generateRandomProductPrice(),
          currency: 'USD',
        },
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${createProductUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CREATED);

      const getProductRequest: V1GetProductsHttpQuery = {
        fields: ['price', 'name'],
        limit: 1,
        offset: 1,
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${getProductUrl}`)
        .set('Accept', 'application/json')
        .send(getProductRequest)
        .expect(HttpStatus.OK);

      const body: V1GetProductsHttpResponse = response.body;

      expect(body.products.length).toEqual(1);
    });
  });

  // Add more test cases for other routes, if needed.
});
