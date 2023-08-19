import {
  v1ApiEndpoints,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1RemoveProductsHttpRequest,
  V1RemoveProductsHttpResponse,
} from '@api/http';
import {
  JwtAuthenticationGuard,
  MockAuthGuard,
} from '@application/application-services/auth';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomProductId,
  generateRandomProductName,
  generateRandomProductPrice,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import * as request from 'supertest';

describe('Remove products', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const removeProductsUrl = v1ApiEndpoints.removeProducts;

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

  it('should not remove product if request is invalid', async () => {
    const removeProductsRequest: V1RemoveProductsHttpRequest = {
      ids: [2, 2, 2] as unknown as string[],
    };

    await request(app.getHttpServer())
      .post(removeProductsUrl)
      .set('Accept', 'application/json')
      .send(removeProductsRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should not remove products if it not exist', async () => {
    const removeProductRequest: V1RemoveProductsHttpRequest = {
      ids: Array.from({ length: 3 }, () => generateRandomProductId()),
    };

    const response = await request(app.getHttpServer())
      .post(removeProductsUrl)
      .set('Accept', 'application/json')
      .send(removeProductRequest)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new ProductDomainExceptions.DoesNotExist(),
      ]),
    );
  });

  it('should remove products', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: generateRandomProductName(),
      price: generateRandomProductPrice(),
    };

    const createResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);
    const { id: productId } =
      createResponse.body as V1CreateProductHttpResponse;

    const removeProductRequest: V1RemoveProductsHttpRequest = {
      ids: [productId],
    };

    const removedResponse = await request(app.getHttpServer())
      .post(removeProductsUrl)
      .set('Accept', 'application/json')
      .send(removeProductRequest)
      .expect(HttpStatus.OK);

    const { ids } = removedResponse.body as V1RemoveProductsHttpResponse;

    expect(ids).toEqual(removeProductRequest.ids);
  });

  // Add more test cases for other routes, if needed.
});
