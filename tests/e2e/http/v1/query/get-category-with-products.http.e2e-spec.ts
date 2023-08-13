import {
  v1ApiEndpoints,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1GetCategoryHttpQuery,
  V1GetCategoryHttpResponse,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get category with products', () => {
  let app: INestApplication;
  const getCategoryUrl = v1ApiEndpoints.getCategory;
  const createCategoryUrl = v1ApiEndpoints.createCategory;
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

  it('should get a category already created', async () => {
    const createCategoryRequest: V1CreateCategoryHttpRequest = {
      name: randomString(),
    };

    const createCategoryResponse = await request(app.getHttpServer())
      .post(createCategoryUrl)
      .set('Accept', 'application/json')
      .send(createCategoryRequest)
      .expect(HttpStatus.CREATED);

    const { id: categoryId } =
      createCategoryResponse.body as V1CreateCategoryHttpResponse;

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 12,
      categoryIds: [categoryId],
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const { id: productId } =
      createProductResponse.body as V1CreateProductHttpResponse;

    const getCategoryQuery: V1GetCategoryHttpQuery = {
      populate_products: true,
    };

    const response = await request(app.getHttpServer())
      .get(getCategoryUrl.replace(':id', categoryId))
      .query(getCategoryQuery)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    const body: V1GetCategoryHttpResponse = response.body;

    expect(body.id).toBe(categoryId);
    expect(body.products?.length).toBeGreaterThanOrEqual(1);
  });

  // Add more test cases for other routes, if needed.
});
