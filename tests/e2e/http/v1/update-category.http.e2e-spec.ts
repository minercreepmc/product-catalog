import {
  v1ApiEndpoints,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
  V1UpdateCategoryHttpRequest,
  V1UpdateCategoryHttpResponse,
} from '@api/http';
import {
  JwtAuthenticationGuard,
  MockAuthGuard,
} from '@application/application-services/auth';
import { CategoryDomainExceptions } from '@domain-exceptions/category';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Update category', () => {
  let app: INestApplication;
  const createCategoryUrl = v1ApiEndpoints.createCategory;
  const updateCategoryUrl = v1ApiEndpoints.updateCategory;

  const createCategoryRequest: V1CreateCategoryHttpRequest = {
    name: randomString(),
  };
  const updateCategoryRequest: V1UpdateCategoryHttpRequest = {
    name: randomString(),
    description: 'Sample description',
  };

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

  it('should update a category and return the new category information', async () => {
    const createResponse = await request(app.getHttpServer())
      .post(createCategoryUrl)
      .set('Accept', 'application/json')
      .send(createCategoryRequest)
      .expect(HttpStatus.CREATED);

    const createBody: V1CreateCategoryHttpResponse = createResponse.body;
    const categoryId = createBody.id;

    const updateResponse = await request(app.getHttpServer())
      .put(updateCategoryUrl.replace(':id', categoryId))
      .set('Accept', 'application/json')
      .send(updateCategoryRequest)
      .expect(HttpStatus.OK);

    const { name, description } =
      updateResponse.body as V1UpdateCategoryHttpResponse;
    expect(name).toEqual(updateCategoryRequest.name);
    expect(description).toEqual(updateCategoryRequest.description);
  });

  it('should not update a category if it not exists', async () => {
    const categoryIdDidNotExist = '123';
    const response = await request(app.getHttpServer())
      .put(updateCategoryUrl.replace(':id', categoryIdDidNotExist))
      .set('Accept', 'application/json')
      .send(updateCategoryRequest)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new CategoryDomainExceptions.DoesNotExist(),
      ]),
    );
  });

  it('should not update a product if the request format is not valid', async () => {
    const productIdDidNotExist = '123';
    const invalidUpdateProductRequest: V1UpdateCategoryHttpRequest = {
      name: '1',
      description: '1',
    };
    const response = await request(app.getHttpServer())
      .put(updateCategoryUrl.replace(':id', productIdDidNotExist))
      .set('Accept', 'application/json')
      .send(invalidUpdateProductRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new CategoryDomainExceptions.NameDoesNotValid(),
        new CategoryDomainExceptions.DescriptionDoesNotValid(),
        //new ProductDomainExceptions.ImageDoesNotValid(),
      ]),
    );
  });

  // Add more test cases for other routes, if needed.
});
