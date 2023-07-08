import { V1CreateCategoryHttpRequest } from '@controllers/http/v1';
import {
  V1GetCategoriesHttpRequest,
  V1GetCategoriesHttpResponse,
} from '@controllers/http/v1/get-categories';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { generateRandomCategoryName } from '@utils/functions';
import * as request from 'supertest';

describe('V1GetCategoriesHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = 'categories';
  const getCategoriesUrl = 'get';
  const createCategoryUrl = 'create';
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

  describe(`${categoriesUrl}/${getCategoriesUrl} (POST)`, () => {
    it('should get something if it not empty', async () => {
      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${getCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send({})
        .expect(HttpStatus.OK);

      const body: V1GetCategoriesHttpResponse = response.body;

      expect(body.categories.length).toBeGreaterThan(0);
    });

    it('should get specified field', async () => {
      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const getCategoriesRequest: V1GetCategoriesHttpRequest = {
        fields: ['name'],
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${getCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send(getCategoriesRequest)
        .expect(HttpStatus.OK);

      const body: V1GetCategoriesHttpResponse = response.body;

      expect(body.categories[0].name).toBeDefined();
    });

    it('limit and offset', async () => {
      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const getCategoryRequest: V1GetCategoriesHttpRequest = {
        fields: ['name'],
        limit: 1,
        offset: 1,
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${getCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send(getCategoryRequest)
        .expect(HttpStatus.OK);

      const body: V1GetCategoriesHttpResponse = response.body;

      expect(body.categories.length).toEqual(1);
    });
  });

  // Add more test cases for other routes, if needed.
});
