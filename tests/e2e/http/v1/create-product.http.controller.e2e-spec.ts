import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import * as request from 'supertest';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
} from '@controllers/http/v1';

describe('V1CreateProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `products/create`;
  const apiPrefix = `api/v1`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //uploadService = moduleFixture.get<UploadService>(UploadService);

    //tempFilePath = TempFileUtil.createTempFileFromBuffer();
    await app.init();
  });

  afterAll(async () => {
    //await uploadService.delete(uploadedTempFilePath);
    //TempFileUtil.deleteFile(tempFilePath);
    await app.close();
  });

  describe(`${productsUrl} (POST)`, () => {
    it('should create a product and return the new product information', async () => {
      const createProductRequest: V1CreateProductHttpRequest = {
        name: randomString(),
        price: 25.99,
        description: 'Sample description',
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}`)
        .set('Accept', 'application/json')
        //.attach('image', tempFilePath)
        .field('name', createProductRequest.name)
        .field('price', createProductRequest.price)
        .field('description', createProductRequest.description)
        .expect(HttpStatus.CREATED);

      const body: V1CreateProductHttpResponse = response.body;

      expect(body.name).toEqual(createProductRequest.name);
      expect(body.price).toEqual(createProductRequest.price);
      expect(body.description).toEqual(createProductRequest.description);
      //expect(body.imageUrl).toBeDefined();

      //uploadedTempFilePath = body.imageUrl;
    });

    it('should not create a product if it already exists', async () => {
      const createProductRequest: V1CreateProductHttpRequest = {
        name: randomString(),
        price: 25.99,
        description: 'asdasdasdasdasd',
      };
      // First, create the product
      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CREATED);

      // Attempt to create the product again
      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.AlreadyExist(),
        ]),
      );
    });

    it('should not create a product if the request format is not valid', async () => {
      const invalidProductRequest: V1CreateProductHttpRequest = {
        name: 'a',
        price: -25.99,
        description: 'wtf',
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}`)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.PriceDoesNotValid(),
          new ProductDomainExceptions.DescriptionDoesNotValid(),
          //new ProductDomainExceptions.ImageDoesNotValid(),
          new ProductDomainExceptions.NameDoesNotValid(),
        ]),
      );
    });
  });

  // Add more test cases for other routes, if needed.
});
