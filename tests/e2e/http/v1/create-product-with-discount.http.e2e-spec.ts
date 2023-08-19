import {
  v1ApiEndpoints,
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
} from '@api/http';
import {
  JwtAuthenticationGuard,
  MockAuthGuard,
} from '@application/application-services/auth';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Create Product with Discount', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;

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

  it('should not create product if discount is not exist', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 25.99,
      description: 'Sample description',
      discountId: '1',
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .field('name', createProductRequest.name)
      .field('price', createProductRequest.price)
      .field('description', createProductRequest.description!)
      .field('discountId', createProductRequest.discountId!);

    expect(createProductResponse.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new DiscountDomainExceptions.DoesNotExist(),
      ]),
    );
  });

  it('should create a product and return the new product information', async () => {
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 12,
    };

    const createDiscountResponse = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const { id: discountId } =
      createDiscountResponse.body as V1CreateDiscountHttpResponse;

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 25.99,
      description: 'Sample description',
      discountId,
    };

    const response = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      //.attach('image', tempFilePath)
      .field('name', createProductRequest.name)
      .field('price', createProductRequest.price)
      .field('description', createProductRequest.description!)
      .field('discountId', createProductRequest.discountId!)
      .expect(HttpStatus.CREATED);

    const body: V1CreateProductHttpResponse = response.body;

    expect(body.name).toEqual(createProductRequest.name);
    expect(body.price).toEqual(createProductRequest.price);
    expect(body.description).toEqual(createProductRequest.description);
    expect(body.discountId).toEqual(createProductRequest.discountId);
    //expect(body.imageUrl).toBeDefined();

    //uploadedTempFilePath = body.imageUrl;
  });

  // Add more test cases for other routes, if needed.
});
