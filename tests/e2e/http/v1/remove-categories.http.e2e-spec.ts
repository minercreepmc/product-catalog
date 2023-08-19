import {
  v1ApiEndpoints,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
  V1RemoveCategoriesHttpRequest,
  V1RemoveCategoriesHttpResponse,
} from '@api/http';
import {
  JwtAuthenticationGuard,
  MockAuthGuard,
} from '@application/application-services/auth';
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

describe('Remove categories', () => {
  let app: INestApplication;
  const createCategoryUrl = v1ApiEndpoints.createCategory;
  const removeCategoriesUrl = v1ApiEndpoints.removeCategories;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should not remove categories if request is invalid', async () => {
    const removeCategoriesRequest: V1RemoveCategoriesHttpRequest = {
      ids: ['', '', ''],
    };

    await request(app.getHttpServer())
      .post(removeCategoriesUrl)
      .set('Accept', 'application/json')
      .send(removeCategoriesRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should not remove categories if it not exist', async () => {
    const removeCategoriesRequest: V1RemoveCategoriesHttpRequest = {
      ids: Array.from({ length: 3 }, () => generateRandomCategoryId()),
    };

    const response = await request(app.getHttpServer())
      .post(removeCategoriesUrl)
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
      .post(createCategoryUrl)
      .set('Accept', 'application/json')
      .send(createCategoryRequest)
      .expect(HttpStatus.CREATED);

    const { id } = createResponse.body as V1CreateCategoryHttpResponse;

    const removeCategoriesRequest: V1RemoveCategoriesHttpRequest = {
      ids: [id],
    };

    const removedResponse = await request(app.getHttpServer())
      .post(removeCategoriesUrl)
      .set('Accept', 'application/json')
      .send(removeCategoriesRequest)
      .expect(HttpStatus.OK);

    const { ids } = removedResponse.body as V1RemoveCategoriesHttpResponse;

    expect(ids).toEqual(removeCategoriesRequest.ids);
  });

  // Add more test cases for other routes, if needed.
});
