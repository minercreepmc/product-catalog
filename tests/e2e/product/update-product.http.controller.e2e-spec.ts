import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductDomainExceptionCodes } from '@product-domain/domain-exceptions';
import { AppModule } from '@src/app.module';
import {
  CreateProductHttpRequestDto,
  UpdateProductHttpRequest,
} from '@src/core/product/interface-adapters/controllers/http';
import { checkResponseForCode } from '@utils/functions';
import * as request from 'supertest';

describe('UpdateProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `/products`;

  const createProductRequest: CreateProductHttpRequestDto = {
    name: 'Sample Product',
    price: {
      amount: 25.99,
      currency: 'USD',
    },
  };
  const updateProductRequest: UpdateProductHttpRequest = {
    name: 'Sample Product',
    price: {
      amount: 29.99,
      currency: 'USD',
    },
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
        .post('/products')
        .set('Accept', 'application/json')
        .send(createProductRequest);

      const productId = createResponse.body.productId;

      // Attempt to create the product again
      const updateResponse = await request(app.getHttpServer())
        .put(`/products/${productId}`)
        .set('Accept', 'application/json')
        .send(updateProductRequest)
        .expect(HttpStatus.OK);

      const { name, price } = updateResponse.body;
      expect(name).toEqual(updateProductRequest.name);
      expect(price).toEqual(updateProductRequest.price);
    });

    it('should not update a product if it not exists', async () => {
      // Attempt to create the product again
      const productIdDidNotExist = '123';
      return request(app.getHttpServer())
        .put(`/products/${productIdDidNotExist}`)
        .set('Accept', 'application/json')
        .send(updateProductRequest)
        .expect((response: request.Response) => {
          const productIsNotExist = checkResponseForCode({
            response,
            statusCode: HttpStatus.CONFLICT,
            codes: [ProductDomainExceptionCodes.ProductIsNotExist],
          });

          expect(productIsNotExist).toBeTruthy();
        })
        .expect(HttpStatus.CONFLICT);
    });

    it('should not update a product if the request format is not valid', async () => {
      // Attempt to create the product again
      const productIdDidNotExist = '123';
      const invalidUpdateProductRequest: UpdateProductHttpRequest = {
        name: '',
        price: {
          amount: -123,
          currency: 'USD',
        },
      };
      return request(app.getHttpServer())
        .put(`/products/${productIdDidNotExist}`)
        .set('Accept', 'application/json')
        .send(invalidUpdateProductRequest)
        .expect((response: request.Response) => {
          const productIsNotExist = checkResponseForCode({
            response,
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            codes: [
              ProductDomainExceptionCodes.NameIsNotValid,
              ProductDomainExceptionCodes.PriceIsNotValid,
            ],
          });

          expect(productIsNotExist).toBeTruthy();
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  // Add more test cases for other routes, if needed.
});
