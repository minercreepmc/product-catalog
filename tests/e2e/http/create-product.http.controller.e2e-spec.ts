import {
  generateRandomCategoryName,
  generateRandomProductName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import * as request from 'supertest';
import {
  CreateProductHttpRequest,
  CreateProductHttpResponse,
} from '@src/interface-adapters/controllers/http';
import { ProductDomainExceptions } from '@domain-exceptions/product';

describe('CreateProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `/products`;

  const createProductRequest: CreateProductHttpRequest = {
    name: generateRandomProductName(),
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
            response.body as CreateProductHttpResponse;

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
      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([new ProductDomainExceptions.DoesExist()]),
      );
    });

    it('should not create a product if the request format is not valid', async () => {
      const invalidProductRequest: CreateProductHttpRequest = {
        name: '',
        price: {
          amount: -25.99,
          currency: 'USD',
        },
        description: '',
        image: 'wtf',
      };

      const response = await request(app.getHttpServer())
        .post(productsUrl)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.PriceDoesNotValid(),
          new ProductDomainExceptions.DescriptionDoesNotValid(),
          new ProductDomainExceptions.ImageDoesNotValid(),
          new ProductDomainExceptions.NameDoesNotValid(),
        ]),
      );
    });
  });

  // Add more test cases for other routes, if needed.
});
