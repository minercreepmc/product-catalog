import { ProductDomainExceptionCodes } from '@domain-exceptions/product';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  CreateProductHttpRequest,
  UpdateProductHttpRequest,
  UpdateProductHttpResponse,
} from '@src/interface-adapters/controllers/http';
import { checkResponseForCode } from '@utils/functions';
import * as request from 'supertest';

describe('UpdateProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `/products`;

  const createProductRequest: CreateProductHttpRequest = {
    name: 'Wtf Product',
    price: {
      amount: 25.99,
      currency: 'USD',
    },
  };
  const updateProductRequest: UpdateProductHttpRequest = {
    name: 'Oke Product',
    price: {
      amount: 29.99,
      currency: 'USD',
    },
    description: 'Sample description',
    image: 'https://example.com/image.png',
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

      const { name, price, description, image } =
        updateResponse.body as UpdateProductHttpResponse;
      expect(name).toEqual(updateProductRequest.name);
      expect(price).toEqual(updateProductRequest.price);
      expect(description).toEqual(updateProductRequest.description);
      expect(image).toEqual(updateProductRequest.image);
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
            codes: [ProductDomainExceptionCodes.DoesNotExist],
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
        description: '',
        image: '',
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
              ProductDomainExceptionCodes.NameDoesNotValid,
              ProductDomainExceptionCodes.PriceDoesNotValid,
              ProductDomainExceptionCodes.DescriptionDoesNotValid,
              ProductDomainExceptionCodes.ImageDoesNotValid,
            ],
          });

          expect(productIsNotExist).toBeTruthy();
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  // Add more test cases for other routes, if needed.
});
