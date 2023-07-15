import {
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import { V1AddParentCategoriesHttpRequest } from '@controllers/http/v1/add-parent-categories';
import {
  V1DetachParentCategoriesHttpRequest,
  V1DetachParentCategoriesHttpResponse,
} from '@controllers/http/v1/detach-parent-categories';
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

describe('V1DetachParentCategoriesHttpController (PUT)', () => {
  let app: INestApplication;
  const categoriesUrl = 'categories';
  const createCategoryUrl = 'create';
  const addParentCategoriesUrl = 'add-parent-categories';
  const detachParentCategoriesUrl = 'detach-parent-categories';
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

  describe(`Detach Sub Categories (PUT)`, () => {
    it('Should not detach parent categories if request is invalid', async () => {
      const detachParentCategoriesRequest: V1DetachParentCategoriesHttpRequest =
        {
          parentIds: [''],
        };

      const categoryId = generateRandomCategoryId();

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${categoryId}/${detachParentCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(detachParentCategoriesRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.ParentIdDoesNotValid(),
        ]),
      );
    });

    it('Should not detach parent categories if either category or parent category does not exist', async () => {
      const detachParentCategoriesRequest: V1DetachParentCategoriesHttpRequest =
        {
          parentIds: [generateRandomCategoryId()],
        };
      const categoryId = generateRandomCategoryId();

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${categoryId}/${detachParentCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(detachParentCategoriesRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.DoesNotExist(),
          new CategoryDomainExceptions.ParentIdDoesNotExist(),
        ]),
      );
    });

    it('Should detach parent categories', async () => {
      const wannaBeParentCreateRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };
      const wannaBeSub: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const wannaBeParentResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(wannaBeParentCreateRequest)
        .expect(HttpStatus.CREATED);

      const wannaBeSubResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(wannaBeSub)
        .expect(HttpStatus.CREATED);

      const wannaBeParentBody =
        wannaBeParentResponse.body as V1CreateCategoryHttpResponse;
      const wannaBeSubBody =
        wannaBeSubResponse.body as V1CreateCategoryHttpResponse;

      const addSubCategoriesRequest: V1AddParentCategoriesHttpRequest = {
        parentIds: [wannaBeParentBody.id],
      };

      await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${wannaBeSubBody.id}/${addParentCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addSubCategoriesRequest)
        .expect(HttpStatus.OK);

      const detachParentCategoriesRequest: V1DetachParentCategoriesHttpRequest =
        {
          parentIds: [wannaBeParentBody.id],
        };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${wannaBeSubBody.id}/${detachParentCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(detachParentCategoriesRequest)
        .expect(HttpStatus.OK);

      const body = response.body as V1DetachParentCategoriesHttpResponse;

      expect(body.parentIds).toIncludeAllMembers([wannaBeParentBody.id]);
      expect(body.categoryId).toEqual(wannaBeSubBody.id);
    });
  });
});
