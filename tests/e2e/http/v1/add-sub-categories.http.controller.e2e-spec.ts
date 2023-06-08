import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  V1AddSubCategoriesHttpRequest,
  V1AddSubCategoriesHttpResponse,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import {
  generateRandomCategoryId,
  generateRandomCategoryName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { AppModule } from '@src/app.module';

describe('V1AddSubCategoriesHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = `categories`;
  const addSubCategoriesUrl = 'add-sub-categories';
  const apiPrefix = 'api/v1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Here, you need to create a valid category and subcategories
    // similar to how it was done in the provided example.
    // After that, you should assign their IDs to the validCategoryId and validSubCategoryIds variables
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`${categoriesUrl} (PUT)`, () => {
    it('Should not add subcategories if the request is invalid', async () => {
      const addSubCategoriesRequest: V1AddSubCategoriesHttpRequest = {
        subCategoryIds: [''],
      };

      const invalidCategoryId = generateRandomCategoryId();

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${invalidCategoryId}/${addSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addSubCategoriesRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.SubCategoryIdsDoesNotValid(),
        ]),
      );
    });

    it('Should not add subcategories if the category or subcategories do not exist', async () => {
      const addSubCategoriesRequest: V1AddSubCategoriesHttpRequest = {
        subCategoryIds: [generateRandomCategoryId()],
      };

      const invalidCategoryId = generateRandomCategoryId();
      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${invalidCategoryId}/${addSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addSubCategoriesRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.DoesNotExist(),
          new CategoryDomainExceptions.SubCategoryIdDoesNotExist(),
        ]),
      );
    });

    it('Should add subcategories successfully when request is valid', async () => {
      const createCategoryFirstRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };
      const createCategorySecondRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const firstResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryFirstRequest)
        .expect(HttpStatus.CREATED);

      const secondResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategorySecondRequest)
        .expect(HttpStatus.CREATED);

      const firstBody: V1CreateCategoryHttpResponse = firstResponse.body;
      const secondBody: V1CreateCategoryHttpResponse = secondResponse.body;

      const addSubCategoriesRequest: V1AddSubCategoriesHttpRequest = {
        subCategoryIds: [firstBody.id],
      };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${categoriesUrl}/${secondBody.id}/${addSubCategoriesUrl}`,
        )
        .set('Accept', 'application/json')
        .send(addSubCategoriesRequest)
        .expect(HttpStatus.OK);

      // Assert the response
      const resultBody: V1AddSubCategoriesHttpResponse = response.body;

      expect(resultBody.categoryId).toBe(secondBody.id);
      expect(resultBody.subCategoryIds[0]).toEqual(firstBody.id);
    });
  });

  // Add more test cases for other routes, if needed.
});
