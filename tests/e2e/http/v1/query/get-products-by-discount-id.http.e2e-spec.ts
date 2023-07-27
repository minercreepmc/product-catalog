import {
  v1ApiEndpoints,
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetProductsHttpQuery,
  V1GetProductsHttpResponse,
  V1UpdateProductHttpRequest,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get products by discount id', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const updateProductUrl = v1ApiEndpoints.updateProduct;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;
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

  it('should work', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 12,
    };
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 12,
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const createDiscountResponse = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const { id: discountId } =
      createDiscountResponse.body as V1CreateDiscountHttpResponse;
    const { id: productId } =
      createProductResponse.body as V1CreateProductHttpResponse;

    const updateProductRequest: V1UpdateProductHttpRequest = {
      discountId,
    };

    await request(app.getHttpServer())
      .put(updateProductUrl.replace(':id', productId))
      .set('Accept', 'application/json')
      .send(updateProductRequest)
      .expect(HttpStatus.OK);

    const getProductQuery: V1GetProductsHttpQuery = {
      limit: 1,
      discount_id: discountId,
    };

    const response = await request(app.getHttpServer())
      .get(getProductsUrl)
      .query(getProductQuery)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const body: V1GetProductsHttpResponse = response.body;

    expect(body.products.length).toEqual(1);
    expect(body.products[0].discount_id).toEqual(discountId);
  });

  // Add more test cases for other routes, if needed.
});
