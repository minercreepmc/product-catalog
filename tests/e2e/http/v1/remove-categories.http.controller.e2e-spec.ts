import {
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import {
  V1RemoveCategoriesHttpRequest,
  V1RemoveCategoriesHttpResponse,
} from '@controllers/http/v1/remove-categories';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomCategoryId,
  generateRandomCategoryName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import * as request from 'supertest';

describe('V1RemoveCategoriesHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = 'categories';
  const createCategoryUrl = 'create';
  const removeCategoriesUrl = 'remove';
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

  describe(`${categoriesUrl}/${removeCategoriesUrl} (POST)`, () => {
    it('should not remove categories if request is invalid', async () => {
      const removeCategoriesRequest: V1RemoveCategoriesHttpRequest = {
        ids: ['', '', ''],
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${removeCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send(removeCategoriesRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should not remove categories if it not exist', async () => {
      const removeCategoriesRequest: V1RemoveCategoriesHttpRequest = {
        ids: Array.from({ length: 3 }, () => generateRandomCategoryId()),
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${removeCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send(removeCategoriesRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('should remove categories', async () => {
      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const createResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const { id } = createResponse.body as V1CreateCategoryHttpResponse;

      const removeCategoriesRequest: V1RemoveCategoriesHttpRequest = {
        ids: [id],
      };

      const removedResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${removeCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send(removeCategoriesRequest)
        .expect(HttpStatus.OK);

      const { ids } = removedResponse.body as V1RemoveCategoriesHttpResponse;

      expect(ids).toEqual(removeCategoriesRequest.ids);
    });
  });

  // Add more test cases for other routes, if needed.
});

