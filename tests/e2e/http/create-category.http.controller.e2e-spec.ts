import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { AppModule } from '@src/app.module';
import { CategoryDomainExceptionCodes } from '@domain-exceptions/category';
import { checkResponseForCode } from '@utils/functions';
import {
  CreateCategoryHttpRequest,
  CreateCategoryHttpResponse,
} from '@controllers/http/create-category';
import { ProductDomainExceptionCodes } from '@domain-exceptions/product';

describe('CreateCategoryHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = `categories`;

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

  describe(`${categoriesUrl} (POST)`, () => {
    it('Should not create a category if the request is invalid', async () => {
      const createCategoryRequest: CreateCategoryHttpRequest = {
        name: '',
        productIds: [''],
        subCategoryIds: [''],
        parentIds: [''],
        description: '',
      };
      const response = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest);

      const isNotValid = checkResponseForCode({
        response,
        codes: [CategoryDomainExceptionCodes.NameDoesNotValid],
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });

      expect(isNotValid).toBeTruthy();
    });

    it('Should not create a category if the category name already exists', async () => {
      const createCategoryRequest = {
        name: faker.commerce.department(),
      };

      await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CONFLICT);

      const doesExist = checkResponseForCode({
        response,
        codes: [CategoryDomainExceptionCodes.AlreadyExist],
        statusCode: HttpStatus.CONFLICT,
      });

      expect(doesExist).toBeTruthy();
    });

    it('should not create a category if parentsIds, subCategories and productIds was provided but does not exist', async () => {
      const createCategoryRequest = {
        name: faker.commerce.department(),
        parentIds: ['not_existing_parent_category_id'],
        subCategoryIds: ['not_existing_sub_category_id'],
        productIds: ['not_existing_product_id'],
      };

      const response = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CONFLICT);

      const doesNotExist = checkResponseForCode({
        response,
        codes: [
          CategoryDomainExceptionCodes.ParentIdDoesNotExist,
          CategoryDomainExceptionCodes.SubCategoryIdDoesNotExist,
          ProductDomainExceptionCodes.DoesNotExist,
        ],
        statusCode: HttpStatus.CONFLICT,
      });

      expect(doesNotExist).toBeTruthy();
    });

    it('should not create a category if parentIds and subCategories overlap', async () => {
      const createCategoryRequest = {
        name: faker.commerce.department(),
        parentIds: ['same_category_id'],
        subCategoryIds: ['same_category_id'],
      };

      const response = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CONFLICT);

      const doesNotExist = checkResponseForCode({
        response,
        codes: [CategoryDomainExceptionCodes.ParentIdAndSubCategoryIdOverlap],
        statusCode: HttpStatus.CONFLICT,
      });

      expect(doesNotExist).toBeTruthy();
    });

    it('Should create a category if the request is valid', async () => {
      const createCategoryOneRequest = {
        name: 'category1',
      };
      const createCategoryTwoRequest = {
        name: 'category2',
      };

      const responseOne = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryOneRequest)
        .expect(HttpStatus.CREATED);

      const bodyOne: CreateCategoryHttpResponse = responseOne.body;

      const responseTwo = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryTwoRequest)
        .expect(HttpStatus.CREATED);

      const bodyTwo: CreateCategoryHttpResponse = responseTwo.body;

      const createCategoryRequest: CreateCategoryHttpRequest = {
        name: faker.commerce.department(),
        parentIds: [bodyOne.id],
        subCategoryIds: [bodyTwo.id],
      };

      const response = await request(app.getHttpServer())
        .post(`/${categoriesUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      expect(response.body.name).toBe(createCategoryRequest.name);
    });
  });

  // Add more test cases for other routes, if needed.
});
