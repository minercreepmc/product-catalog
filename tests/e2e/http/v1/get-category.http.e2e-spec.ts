import {
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import { v1ApiEndpoints } from '@controllers/http/v1/endpoint.v1';
import { V1GetCategoryHttpResponse } from '@controllers/http/v1/get-category';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { generateRandomCategoryName } from '@utils/functions';
import * as request from 'supertest';

describe('Get category', () => {
  let app: INestApplication;
  const getCategoryUrl = v1ApiEndpoints.getCategory;
  const createCategoryUrl = v1ApiEndpoints.createCategory;

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

  describe(`Get category (GET)`, () => {
    it('should get a category already created', async () => {
      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const createResponse = await request(app.getHttpServer())
        .post(createCategoryUrl)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const createBody = createResponse.body as V1CreateCategoryHttpResponse;

      const response = await request(app.getHttpServer())
        .get(getCategoryUrl.replace(':id', createBody.id))
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);

      const body: V1GetCategoryHttpResponse = response.body;

      expect(body.name).toBe(createBody.name);
    });
  });

  // Add more test cases for other routes, if needed.
});
