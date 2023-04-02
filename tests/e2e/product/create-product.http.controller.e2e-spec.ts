import { checkResponseForCode } from '@utils/functions';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductDomainExceptionCodes } from '@product-domain/domain-exceptions';
import { AppModule } from '@src/app.module';
import { CreateProductHttpRequestDto } from '@src/core/product/interface-adapters/controllers/http';
import * as request from 'supertest';
import { CreateProductResponseDto } from '@product-use-case/create-product/dtos';

describe('CreateProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `/products`;

  const createProductRequest: CreateProductHttpRequestDto = {
    name: 'Sample Product',
    price: {
      amount: 25.99,
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

  describe(`${productsUrl} (POST)`, () => {
    it('should create a product and return the new product information', () => {
      return request(app.getHttpServer())
        .post(productsUrl)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect((response: request.Response) => {
          const { name, price, description, image } =
            response.body as CreateProductResponseDto;

          expect(name).toEqual(createProductRequest.name);
          expect(price).toEqual(createProductRequest.price);
          expect(description).toEqual(createProductRequest.description);
          expect(image).toEqual(createProductRequest.image);
        })
        .expect(HttpStatus.CREATED);
    });

    it('should not create a product if it already exists', async () => {
      // First, create the product
      await request(app.getHttpServer())
        .post('/products')
        .set('Accept', 'application/json')
        .send(createProductRequest);

      // Attempt to create the product again
      return request(app.getHttpServer())
        .post('/products')
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect((response: request.Response) => {
          const productIsExist = checkResponseForCode({
            response,
            statusCode: HttpStatus.CONFLICT,
            codes: [ProductDomainExceptionCodes.ProductIsExist],
          });

          expect(productIsExist).toBeTruthy();
        })
        .expect(HttpStatus.CONFLICT);
    });

    it('should not create a product if the request format is not valid', async () => {
      const invalidProductRequest: CreateProductHttpRequestDto = {
        name: '',
        price: {
          amount: -25.99,
          currency: 'USD',
        },
        description: '',
        image: 'wtf',
      };

      return request(app.getHttpServer())
        .post(productsUrl)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect((response: request.Response) => {
          const priceIsNotValid = checkResponseForCode({
            response,
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            codes: [
              ProductDomainExceptionCodes.PriceIsNotValid,
              ProductDomainExceptionCodes.NameIsNotValid,
              ProductDomainExceptionCodes.DescriptionIsNotValid,
              ProductDomainExceptionCodes.ImageIsNotValid,
            ],
          });

          expect(priceIsNotValid).toBeTruthy();
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  // Add more test cases for other routes, if needed.
});
