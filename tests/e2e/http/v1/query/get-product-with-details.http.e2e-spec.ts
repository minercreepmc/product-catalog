import {
  v1ApiEndpoints,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetProductHttpQuery,
} from '@api/http';
import { ProductWithDetailsSchema } from '@database/repositories/pg/product';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get product with details', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;
  const createCategoryUrl = v1ApiEndpoints.createCategory;
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
    const createCategoryRequest: V1CreateCategoryHttpRequest = {
      name: randomString(),
    };
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 12,
    };

    const createDiscountResponse = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const createCategoryResponse = await request(app.getHttpServer())
      .post(createCategoryUrl)
      .set('Accept', 'application/json')
      .send(createCategoryRequest)
      .expect(HttpStatus.CREATED);

    const { id: discountId } =
      createDiscountResponse.body as V1CreateDiscountHttpResponse;
    const { id: categoryId } =
      createCategoryResponse.body as V1CreateCategoryHttpResponse;

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 12,
      discountId,
      categoryIds: [categoryId],
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const { id: productId } =
      createProductResponse.body as V1CreateProductHttpResponse;
    const getProductQuery: V1GetProductHttpQuery = {
      populate_details: true,
    };

    expect(productId).toBeDefined();

    const response = await request(app.getHttpServer())
      .get(getProductUrl.replace(':id', productId))
      .query(getProductQuery)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const body: ProductWithDetailsSchema = response.body;

    expect(body.id).toEqual(productId);
    expect(body.discount.id).toEqual(discountId);
    expect(body.discount.name).toEqual(createDiscountRequest.name);
    expect(body.discount.percentage).toEqual(createDiscountRequest.percentage);
    expect(body.categories[0].id).toEqual(categoryId);
  });

  // Add more test cases for other routes, if needed.
});
