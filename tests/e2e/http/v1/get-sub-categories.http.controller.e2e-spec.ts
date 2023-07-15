import {
  V1AddSubCategoriesHttpRequest,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import {
  V1GetSubCategoriesHttpRequest,
  V1GetSubCategoriesHttpResponse,
} from '@controllers/http/v1/get-sub-categories';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { generateRandomCategoryName } from '@utils/functions';
import * as request from 'supertest';

describe('V1GetSubCategoriesHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = 'categories';
  const getSubCategories = 'get-sub-categories';
  const createCategoryUrl = 'create';
  const addSubCategoriesUrl = 'add-sub-categories';
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

  describe(`Get subcategories use case (GET)`, () => {
    it('should get something if it not empty', async () => {
      const createCategoryRequest1: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };
      const createCategoryRequest2: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };
      const createResponse1 = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest1)
        .expect(HttpStatus.CREATED);

      const createResponse2 = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest2)
        .expect(HttpStatus.CREATED);

      const body1: V1CreateCategoryHttpResponse = createResponse1.body;
      const body2: V1CreateCategoryHttpResponse = createResponse2.body;

      const addSubCategoryRequest: V1AddSubCategoriesHttpRequest = {
        subIds: [body2.id],
      };
      await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${body1.id}/${addSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addSubCategoryRequest)
        .expect(HttpStatus.OK);

      const getRequest: V1GetSubCategoriesHttpRequest = {
        fields: ['subCategories'],
      };
      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${categoriesUrl}/${body1.id}/${getSubCategories}`)
        .set('Accept', 'application/json')
        .send(getRequest)
        .expect(HttpStatus.OK);

      const body: V1GetSubCategoriesHttpResponse = response.body;

      expect(body.subCategories.length).toBeGreaterThan(0);
    });
  });

  // Add more test cases for other routes, if needed.
});
