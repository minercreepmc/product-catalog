import {
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import {
  V1AddParentCategoriesHttpRequest,
  V1AddParentCategoriesHttpResponse,
} from '@controllers/http/v1/add-parent-categories';
import {
  V1GetCategoryHttpRequest,
  V1GetCategoryHttpResponse,
} from '@controllers/http/v1/get-category';
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
import { promisify } from 'util';
const sleep = promisify(setTimeout);

describe('V1AddParentCategoriesHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = `categories`;
  const createCategorysUrl = 'create';
  const addParentCategoriesUrl = 'add-parent-categories';
  const getParentCategoryUrl = 'get';
  const apiPrefix = 'api/v1';

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

  describe(`${categoriesUrl} (PUT)`, () => {
    it('Should not add parents if the request is invalid', async () => {
      const addParentCategoriesRequest: V1AddParentCategoriesHttpRequest = {
        parentIds: [''],
      };

      const invalidCategoryId = generateRandomCategoryId();

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${invalidCategoryId}/${addParentCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addParentCategoriesRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.ParentIdDoesNotValid(),
        ]),
      );
    });

    it('Should not add parentcategories if the category or parentcategories do not exist', async () => {
      const addParentCategoriesRequest: V1AddParentCategoriesHttpRequest = {
        parentIds: [generateRandomCategoryId()],
      };

      const invalidCategoryId = generateRandomCategoryId();
      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${invalidCategoryId}/${addParentCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addParentCategoriesRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.DoesNotExist(),
          new CategoryDomainExceptions.ParentIdDoesNotExist(),
        ]),
      );
    });

    it('Should add parent categories successfully when request is valid', async () => {
      const createCategoryFirstRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };
      const createCategorySecondRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const firstResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategorysUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryFirstRequest)
        .expect(HttpStatus.CREATED);

      const secondResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategorysUrl}`)
        .set('Accept', 'application/json')
        .send(createCategorySecondRequest)
        .expect(HttpStatus.CREATED);

      const wannaBeSub: V1CreateCategoryHttpResponse = firstResponse.body;
      const wannaBeParent: V1CreateCategoryHttpResponse = secondResponse.body;

      const addParentCategoriesRequest: V1AddParentCategoriesHttpRequest = {
        parentIds: [wannaBeParent.id],
      };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${wannaBeSub.id}/${addParentCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addParentCategoriesRequest)
        .expect(HttpStatus.OK);

      // Assert the response
      const resultBody: V1AddParentCategoriesHttpResponse = response.body;

      expect(resultBody.categoryId).toBe(wannaBeSub.id);
      expect(resultBody.parentIds[0]).toEqual(wannaBeParent.id);
      const wannaBeParentRequest: V1GetCategoryHttpRequest = {};

      // Poll method
      let wannaBeParentBody: V1GetCategoryHttpResponse;
      for (let i = 0; i < 10; i++) {
        const wannaBeParentResponse = await request(app.getHttpServer())
          .put(
            `/${apiPrefix}/${categoriesUrl}/${wannaBeParent.id}/${getParentCategoryUrl}`,
          )
          .set('Accept', 'application/json')
          .send(wannaBeParentRequest)
          .expect(HttpStatus.OK);

        wannaBeParentBody =
          wannaBeParentResponse.body as V1GetCategoryHttpResponse;

        if (wannaBeParentBody.subIds[0] === wannaBeSub.id) {
          break;
        }

        await sleep(1000);
      }

      expect(wannaBeParentBody.subIds[0]).toEqual(wannaBeSub.id);
    }, 10000);
  });

  // Add more test cases for other routes, if needed.
});
