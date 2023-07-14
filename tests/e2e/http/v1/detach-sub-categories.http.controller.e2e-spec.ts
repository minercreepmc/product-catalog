import {
  V1AddSubCategoriesHttpRequest,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import {
  V1DetachSubCategoriesHttpRequest,
  V1DetachSubCategoriesHttpResponse,
} from '@controllers/http/v1/detach-sub-categories';
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

describe('V1DetachSubCategoriesHttpController (PUT)', () => {
  let app: INestApplication;
  const categoriesUrl = 'categories';
  const createCategoryUrl = 'create';
  const addSubCategoriesUrl = 'add-sub-categories';
  const detachSubCategoriesUrl = 'detach-sub-categories';
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
    it('Should not detach sub categories if request is invalid', async () => {
      const detachSubCategoriesRequest: V1DetachSubCategoriesHttpRequest = {
        subIds: [''],
      };

      const categoryId = generateRandomCategoryId();

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${categoryId}/${detachSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(detachSubCategoriesRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.SubCategoryIdsDoesNotValid(),
        ]),
      );
    });

    it('Should not detach sub categories if either category or sub category does not exist', async () => {
      const detachSubCategoriesRequest: V1DetachSubCategoriesHttpRequest = {
        subIds: [generateRandomCategoryId()],
      };
      const categoryId = generateRandomCategoryId();

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${categoryId}/${detachSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(detachSubCategoriesRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.DoesNotExist(),
          new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
        ]),
      );
    });

    it('Should detach sub categories', async () => {
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

      const addSubCategoriesRequest: V1AddSubCategoriesHttpRequest = {
        subCategoryIds: [wannaBeSubBody.id],
      };

      await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${wannaBeParentBody.id}/${addSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addSubCategoriesRequest)
        .expect(HttpStatus.OK);

      const detachSubCategoriesRequest: V1DetachSubCategoriesHttpRequest = {
        subIds: [wannaBeSubBody.id],
      };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${wannaBeParentBody.id}/${detachSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(detachSubCategoriesRequest)
        .expect(HttpStatus.OK);

      const body = response.body as V1DetachSubCategoriesHttpResponse;

      expect(body.subIds).toIncludeAllMembers([wannaBeSubBody.id]);
      expect(body.categoryId).toEqual(wannaBeParentBody.id);
    });
  });
});
