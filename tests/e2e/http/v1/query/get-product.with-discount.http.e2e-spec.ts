import {
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetProductHttpQuery,
  V1UpdateProductHttpRequest,
} from '@controllers/http/v1';
import {
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
} from '@controllers/http/v1/create-discount';
import { v1ApiEndpoints } from '@controllers/http/v1/endpoint.v1';
import { ProductWithDetailsSchema } from '@database/repositories/pg/product';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get product with discount', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const updateProductUrl = v1ApiEndpoints.updateProduct;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;
  const getProductUrl = v1ApiEndpoints.getProduct;

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

    const getProductQuery: V1GetProductHttpQuery = {
      populate_discount: true,
    };

    const response = await request(app.getHttpServer())
      .get(getProductUrl.replace(':id', productId))
      .query(getProductQuery)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const body: ProductWithDetailsSchema = response.body;

    expect(body.id).toEqual(productId);
    expect(body.discount_id).toEqual(discountId);
    expect(body.discount_name).toEqual(createDiscountRequest.name);
    expect(body.discount_percentage).toEqual(createDiscountRequest.percentage);
  });

  // Add more test cases for other routes, if needed.
});
