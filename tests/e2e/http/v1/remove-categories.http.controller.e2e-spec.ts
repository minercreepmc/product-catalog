import {
  V1AddSubCategoriesHttpRequest,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import { V1AddParentCategoriesHttpRequest } from '@controllers/http/v1/add-parent-categories';
import { V1GetCategoryHttpResponse } from '@controllers/http/v1/get-category';
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
import { promisify } from 'util';
const sleep = promisify(setTimeout);

describe('V1RemoveCategoriesHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = 'categories';
  const createCategoryUrl = 'create';
  const removeCategoriesUrl = 'remove';
  const getCategoryUrl = 'get';
  const addSubCategoryUrl = 'add-sub-categories';
  const addParentCategoryUrl = 'add-parent-categories';
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

    it('should remove detached categories', async () => {
      const createCategoryRequest1: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const createCategoryRequest2: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const createCategoryRequest3: V1CreateCategoryHttpRequest = {
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

      const createResponse3 = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest3)
        .expect(HttpStatus.CREATED);

      const { id: wannaBeMain } =
        createResponse1.body as V1CreateCategoryHttpResponse;
      const { id: wannaBeSub } =
        createResponse2.body as V1CreateCategoryHttpResponse;
      const { id: wannaBeParent } =
        createResponse3.body as V1CreateCategoryHttpResponse;

      const addSubCategoryRequest: V1AddSubCategoriesHttpRequest = {
        subIds: [wannaBeSub],
      };

      await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${wannaBeMain}/${addSubCategoryUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addSubCategoryRequest)
        .expect(HttpStatus.OK);

      const addParentCategoryRequest: V1AddParentCategoriesHttpRequest = {
        parentIds: [wannaBeParent],
      };

      await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${wannaBeMain}/${addParentCategoryUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addParentCategoryRequest)
        .expect(HttpStatus.OK);

      const removeMainCategoriesRequest: V1RemoveCategoriesHttpRequest = {
        ids: [wannaBeMain],
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${removeCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send(removeMainCategoriesRequest)
        .expect(HttpStatus.OK);

      let getParentBody: V1GetCategoryHttpResponse;
      let getSubBody: V1GetCategoryHttpResponse;

      for (let i = 0; i < 10; i++) {
        const parentResponse = await request(app.getHttpServer())
          .put(
            `/${apiPrefix}/${categoriesUrl}/${wannaBeParent}/${getCategoryUrl}`,
          )
          .set('Accept', 'application/json')
          .send({})
          .expect(HttpStatus.OK);

        const subResponse = await request(app.getHttpServer())
          .put(`/${apiPrefix}/${categoriesUrl}/${wannaBeSub}/${getCategoryUrl}`)
          .set('Accept', 'application/json')
          .send({})
          .expect(HttpStatus.OK);

        getParentBody = parentResponse.body as V1GetCategoryHttpResponse;
        getSubBody = subResponse.body as V1GetCategoryHttpResponse;

        if (
          !getParentBody.subIds.includes(wannaBeMain) &&
          !getSubBody.parentIds.includes(wannaBeMain)
        ) {
          break;
        }

        await sleep(1000);
      }

      expect(getParentBody.subIds).not.toIncludeAnyMembers([wannaBeMain]);
      expect(getSubBody.parentIds).not.toIncludeAnyMembers([wannaBeMain]);
    }, 10000);
  });

  // Add more test cases for other routes, if needed.
});

// let parentBody: V1GetCategoryHttpResponse;
// let subBody: V1GetCategoryHttpResponse;
// for (let i = 0; i < 10; i++) {
//   if (parentIds.length > 0) {
//     const parentResponse = await request(app.getHttpServer())
//       .put(
//         `/${apiPrefix}/${categoriesUrl}/${parentIds[0]}/${getCategoryUrl}`,
//       )
//       .set('Accept', 'application/json')
//       .send({})
//       .expect(HttpStatus.OK);
//
//     parentBody = parentResponse.body as V1GetCategoryHttpResponse;
//   }
//
//   if (subIds.length > 0) {
//     const subResponse = await request(app.getHttpServer())
//       .put(
//         `/${apiPrefix}/${categoriesUrl}/${subIds[0]}/${getCategoryUrl}`,
//       )
//       .set('Accept', 'application/json')
//       .send({})
//       .expect(HttpStatus.OK);
//
//     subBody = subResponse.body as V1GetCategoryHttpResponse;
//   }
//
//   if (
//     !parentBody.subIds.includes(ids[0]) &&
//     !subBody.parentIds.includes(ids[0])
//   ) {
//     break;
//   }
//   await sleep(100);
// }
// expect(parentBody.subIds).not.toIncludeAnyMembers(ids);
// expect(subBody.parentIds).not.toIncludeAnyMembers(ids);
