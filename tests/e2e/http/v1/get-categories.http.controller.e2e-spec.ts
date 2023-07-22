import { V1CreateCategoryHttpRequest } from '@controllers/http/v1';
import {
  V1GetCategoriesHttpQuery,
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

  describe(`${categoriesUrl} (GET)`, () => {
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
        .get(`/${apiPrefix}/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);

      const body: V1GetCategoriesHttpResponse = response.body;

      expect(body.categories.length).toBeGreaterThan(0);
    });

    it('should get with filter ', async () => {
      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const getCategoriesQuery: V1GetCategoriesHttpQuery = {
        limit: 1,
      };

      const response = await request(app.getHttpServer())
        .get(`/${apiPrefix}/${categoriesUrl}`)
        .query(getCategoriesQuery)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);

      const body: V1GetCategoriesHttpResponse = response.body;

      expect(body.categories.length).toBe(1);
    });
  });

  // Add more test cases for other routes, if needed.
});
