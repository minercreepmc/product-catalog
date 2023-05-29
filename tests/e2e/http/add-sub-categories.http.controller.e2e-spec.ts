import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  AddSubCategoriesHttpRequest,
  AddSubCategoriesHttpResponse,
} from '@controllers/http/add-sub-categories';
import {
  generateRandomCategoryId,
  generateRandomCategoryName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { AppModule } from '@src/app.module';
import {
  CreateCategoryHttpRequest,
  CreateCategoryHttpResponse,
} from '@controllers/http/create-category';

describe('AddSubCategoriesHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = `categories`;
  const addSubCategoriesUrl = 'add-sub-categories';

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
      const addSubCategoriesRequest: AddSubCategoriesHttpRequest = {
        subCategoryIds: [''],
      };

      const invalidCategoryId = generateRandomCategoryId();
      const response = await request(app.getHttpServer())
        .put(`/${categoriesUrl}/${invalidCategoryId}/${addSubCategoriesUrl}`)
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
      const addSubCategoriesRequest: AddSubCategoriesHttpRequest = {
        subCategoryIds: [generateRandomCategoryId()],
      };

      const invalidCategoryId = generateRandomCategoryId();
      const response = await request(app.getHttpServer())
        .put(`/${categoriesUrl}/${invalidCategoryId}/${addSubCategoriesUrl}`)
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
      const createCategoryFirstRequest: CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };
      const createCategorySecondRequest: CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
      };

      const firstResponse = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryFirstRequest)
        .expect(HttpStatus.CREATED);

      const secondResponse = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategorySecondRequest)
        .expect(HttpStatus.CREATED);

      const firstBody: CreateCategoryHttpResponse = firstResponse.body;
      const secondBody: CreateCategoryHttpResponse = secondResponse.body;

      const addSubCategoriesRequest: AddSubCategoriesHttpRequest = {
        subCategoryIds: [firstBody.id],
      };

      const response = await request(app.getHttpServer())
        .put(`/${categoriesUrl}/${secondBody.id}/${addSubCategoriesUrl}`)
        .set('Accept', 'application/json')
        .send(addSubCategoriesRequest)
        .expect(HttpStatus.OK);

      // Assert the response
      const resultBody: AddSubCategoriesHttpResponse = response.body;

      expect(resultBody.categoryId).toBe(secondBody.id);
      expect(resultBody.subCategoryIds[0]).toEqual(firstBody.id);
    });
  });

  // Add more test cases for other routes, if needed.
});
