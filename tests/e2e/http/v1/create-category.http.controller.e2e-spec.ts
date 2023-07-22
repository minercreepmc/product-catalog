import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  generateRandomCategoryName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import {
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
} from '@controllers/http/v1';
import { ProductDomainExceptions } from '@domain-exceptions/product';

describe('V1CreateCategoryHttpController (e2e)', () => {
  let app: INestApplication;
  const categoriesUrl = `categories`;
  const createCategoryUrl = 'create';
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

  describe(`${categoriesUrl} (POST)`, () => {
    it('Should not create a category if the request is invalid', async () => {
      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: '1',
        description: '1',
      };
      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.NameDoesNotValid(),
          new CategoryDomainExceptions.DescriptionDoesNotValid(),
        ]),
      );
    });

    it('Should not create a category if the category name already exists', async () => {
      const createCategoryRequest = {
        name: generateRandomCategoryName(),
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.AlreadyExist(),
        ]),
      );
    });

    it('Should create a category if the request is valid', async () => {
      const createCategoryRequest = {
        name: generateRandomCategoryName(),
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      const { name }: V1CreateCategoryHttpResponse = response.body;

      expect(name).toBe(createCategoryRequest.name);
    });
  });

  // Add more test cases for other routes, if needed.
});
