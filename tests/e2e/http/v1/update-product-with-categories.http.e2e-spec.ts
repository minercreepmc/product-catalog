import {
  v1ApiEndpoints,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1UpdateProductHttpRequest,
  V1UpdateProductHttpResponse,
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

describe('Update product with categories', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const updateProductUrl = v1ApiEndpoints.updateProduct;
  const createCategoryUrl = v1ApiEndpoints.createCategory;

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

  it('it should work', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 2,
    };
    const createCategoryRequest: V1CreateCategoryHttpRequest = {
      name: randomString(),
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const createCategoryResponse = await request(app.getHttpServer())
      .post(createCategoryUrl)
      .set('Accept', 'application/json')
      .send(createCategoryRequest)
      .expect(HttpStatus.CREATED);

    let updateProductRequest: V1UpdateProductHttpRequest = {
      name: randomString(),
      price: 20,
      description: 'Sample description',
      categoryIds: [createCategoryResponse.body.id],
    };

    const { id: productId }: V1CreateProductHttpResponse =
      createProductResponse.body;
    const { id: categoryId }: V1CreateCategoryHttpResponse =
      createCategoryResponse.body;

    let updateResponse = await request(app.getHttpServer())
      .put(updateProductUrl.replace(':id', productId))
      .set('Accept', 'application/json')
      .send(updateProductRequest)
      .expect(HttpStatus.OK);

    const { name, price, description, categoryIds } =
      updateResponse.body as V1UpdateProductHttpResponse;
    expect(name).toEqual(updateProductRequest.name);
    expect(price).toEqual(updateProductRequest.price);
    expect(description).toEqual(updateProductRequest.description);
    expect(categoryIds).toEqual([categoryId]);

    updateProductRequest = {
      categoryIds: [],
    };

    updateResponse = await request(app.getHttpServer())
      .put(updateProductUrl.replace(':id', productId))
      .set('Accept', 'application/json')
      .send(updateProductRequest)
      .expect(HttpStatus.OK);

    expect(updateResponse.body.categoryIds).toEqual([]);
  });

  // Add more test cases for other routes, if needed.
});
