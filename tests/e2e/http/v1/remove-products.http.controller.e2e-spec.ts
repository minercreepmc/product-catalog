import {
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
} from '@controllers/http/v1';
import {
  V1RemoveProductsHttpRequest,
  V1RemoveProductsHttpResponse,
} from '@controllers/http/v1/remove-products';
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

describe('V1RemoveProductsHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = 'products';
  const createProductUrl = 'create';
  const removeProductUrl = 'remove';
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

  describe(`${productsUrl}/${removeProductUrl} (POST)`, () => {
    it('should not remove product if request is invalid', async () => {
      const removeProductRequest: V1RemoveProductsHttpRequest = {
        ids: [2, 2, 2] as unknown as string[],
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${removeProductUrl}`)
        .set('Accept', 'application/json')
        .send(removeProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should not remove products if it not exist', async () => {
      const removeProductRequest: V1RemoveProductsHttpRequest = {
        ids: Array.from({ length: 3 }, () => generateRandomProductId()),
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${removeProductUrl}`)
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
        .post(`/${apiPrefix}/${productsUrl}/${createProductUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CREATED);
      const { id: productId } =
        createResponse.body as V1CreateProductHttpResponse;

      const removeProductRequest: V1RemoveProductsHttpRequest = {
        ids: [productId],
      };

      const removedResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${removeProductUrl}`)
        .set('Accept', 'application/json')
        .send(removeProductRequest)
        .expect(HttpStatus.OK);

      const { ids } = removedResponse.body as V1RemoveProductsHttpResponse;

      expect(ids).toEqual(removeProductRequest.ids);
    });
  });

  // Add more test cases for other routes, if needed.
});
