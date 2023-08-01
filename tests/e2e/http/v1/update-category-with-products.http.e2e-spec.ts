import {
  v1ApiEndpoints,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
  V1CreateProductHttpRequest,
  V1UpdateCategoryHttpRequest,
  V1UpdateCategoryHttpResponse,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Update category', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const createCategoryUrl = v1ApiEndpoints.createCategory;
  const updateCategoryUrl = v1ApiEndpoints.updateCategory;

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

  it('should update products in category', async () => {
    const createCategoryRequest: V1CreateCategoryHttpRequest = {
      name: randomString(),
    };

    const createCategoryResponse = await request(app.getHttpServer())
      .post(createCategoryUrl)
      .set('Accept', 'application/json')
      .send(createCategoryRequest)
      .expect(HttpStatus.CREATED);

    const { id: categoryId }: V1CreateCategoryHttpResponse =
      createCategoryResponse.body;

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

    const updateCategoryRequest: V1UpdateCategoryHttpRequest = {
      name: randomString(),
      description: randomString(),
      productIds: [],
    };

    const updateResponse = await request(app.getHttpServer())
      .put(updateCategoryUrl.replace(':id', categoryId))
      .set('Accept', 'application/json')
      .send(updateCategoryRequest)
      .expect(HttpStatus.OK);

    const { name, productIds, description } =
      updateResponse.body as V1UpdateCategoryHttpResponse;
    expect(name).toEqual(updateCategoryRequest.name);
    expect(productIds).toEqual([]);
    expect(description).toEqual(updateCategoryRequest.description);
  });

  // Add more test cases for other routes, if needed.
});
