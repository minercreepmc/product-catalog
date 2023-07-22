import { ProductDomainExceptions } from '@domain-exceptions/product';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1UpdateProductHttpRequest,
  V1UpdateProductHttpResponse,
} from '@controllers/http/v1';
import {
  generateRandomProductPrice,
  mapDomainExceptionsToObjects,
  randomString,
} from '@utils/functions';
import * as request from 'supertest';
import { v5 as uuid } from 'uuid';

describe('V1UpdateProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `products`;
  const createProductUrl = 'create';
  const updateProductUrl = 'update';
  const apiPrefix = `api/v1`;

  const createProductRequest: V1CreateProductHttpRequest = {
    name: randomString(),
    price: generateRandomProductPrice(),
  };
  const updateProductRequest: V1UpdateProductHttpRequest = {
    name: randomString(),
    price: generateRandomProductPrice(),
    description: 'Sample description',
  };

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

  describe(`${productsUrl} (PUT)`, () => {
    it('should update a product and return the new product information', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${createProductUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CREATED);

      const createBody: V1CreateProductHttpResponse = createResponse.body;
      const productId = createBody.id;

      // Attempt to create the product again
      const updateResponse = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${updateProductUrl}`)
        .set('Accept', 'application/json')
        .send(updateProductRequest)
        .expect(HttpStatus.OK);

      const { name, price, description } =
        updateResponse.body as V1UpdateProductHttpResponse;
      expect(name).toEqual(updateProductRequest.name);
      expect(price).toEqual(updateProductRequest.price);
      expect(description).toEqual(updateProductRequest.description);
    });

    it('should not update a product if it not exists', async () => {
      // Attempt to create the product again
      const productIdDidNotExist = '123';
      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${productIdDidNotExist}/${updateProductUrl}`,
        )
        .set('Accept', 'application/json')
        .send(updateProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('should not update a product if the request format is not valid', async () => {
      const productIdDidNotExist = '123';
      const invalidUpdateProductRequest: V1UpdateProductHttpRequest = {
        name: '1',
        price: -123,
        description: '1',
      };
      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${productIdDidNotExist}/${updateProductUrl}`,
        )
        .set('Accept', 'application/json')
        .send(invalidUpdateProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.NameDoesNotValid(),
          new ProductDomainExceptions.PriceDoesNotValid(),
          new ProductDomainExceptions.DescriptionDoesNotValid(),
          //new ProductDomainExceptions.ImageDoesNotValid(),
        ]),
      );
    });
  });

  // Add more test cases for other routes, if needed.
});
