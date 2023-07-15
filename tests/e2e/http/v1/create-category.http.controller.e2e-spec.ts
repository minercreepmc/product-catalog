import { HttpStatus } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import {
  generateRandomCategoryId,
  generateRandomCategoryName,
  generateRandomProductId,
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
        name: '',
        productIds: [''],
        subCategoryIds: [''],
        parentIds: [''],
        description: '',
      };
      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.NameDoesNotValid(),
          new ProductDomainExceptions.IdDoesNotValid(),
          new CategoryDomainExceptions.SubIdsDoesNotValid(),
          new CategoryDomainExceptions.ParentIdDoesNotValid(),
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

    it('should not create a category if parentsIds, subCategories and productIds was provided but does not exist', async () => {
      const createCategoryRequest = {
        name: generateRandomCategoryName(),
        parentIds: [generateRandomCategoryId()],
        subCategoryIds: [generateRandomCategoryId()],
        productIds: [generateRandomProductId()],
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.ParentIdDoesNotExist(),
          new CategoryDomainExceptions.SubIdDoesNotExist(),
          new ProductDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('should not create a category if parentIds and subCategories overlap', async () => {
      const randomId = generateRandomCategoryId();
      const createCategoryRequest = {
        name: generateRandomCategoryName(),
        parentIds: [randomId],
        subCategoryIds: [randomId],
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new CategoryDomainExceptions.ParentIdAndSubIdOverlap(),
        ]),
      );
    });

    it('Should create a category if the request is valid', async () => {
      const createCategoryOneRequest = {
        name: generateRandomCategoryName(),
      };
      const createCategoryTwoRequest = {
        name: generateRandomCategoryName(),
      };

      const responseOne = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryOneRequest)
        .expect(HttpStatus.CREATED);

      const bodyOne: V1CreateCategoryHttpResponse = responseOne.body;

      const responseTwo = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryTwoRequest)
        .expect(HttpStatus.CREATED);

      const bodyTwo: V1CreateCategoryHttpResponse = responseTwo.body;

      const createCategoryRequest: V1CreateCategoryHttpRequest = {
        name: generateRandomCategoryName(),
        parentIds: [bodyOne.id],
        subCategoryIds: [bodyTwo.id],
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${categoriesUrl}/${createCategoryUrl}`)
        .set('Accept', 'application/json')
        .send(createCategoryRequest)
        .expect(HttpStatus.CREATED);

      expect(response.body.name).toBe(createCategoryRequest.name);
    });
  });

  // Add more test cases for other routes, if needed.
});
