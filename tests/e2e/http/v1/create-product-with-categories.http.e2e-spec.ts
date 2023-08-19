import {
  v1ApiEndpoints,
  V1CreateCategoryHttpRequest,
  V1CreateCategoryHttpResponse,
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
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

describe('Create Product with Categories', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const createCategoryUrl = v1ApiEndpoints.createCategory;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthenticationGuard)
      .useClass(MockAuthGuard)
      .compile();

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

  it('should not create product if category is not exist', async () => {
    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 25.99,
      description: 'Sample description',
      categoryIds: ['1'],
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .field('name', createProductRequest.name)
      .field('price', createProductRequest.price)
      .field('description', createProductRequest.description!)
      .field('categoryIds[0]', createProductRequest.categoryIds![0]);

    expect(createProductResponse.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new CategoryDomainExceptions.DoesNotExist(),
      ]),
    );
  });

  it('should create a product and return the new product information', async () => {
    const createCategoryRequest: V1CreateCategoryHttpRequest = {
      name: randomString(),
    };

    const createCategoryResponse = await request(app.getHttpServer())
      .post(createCategoryUrl)
      .set('Accept', 'application/json')
      .send(createCategoryRequest)
      .expect(HttpStatus.CREATED);

    const { id: categoryId } =
      createCategoryResponse.body as V1CreateCategoryHttpResponse;

    const createProductRequest: V1CreateProductHttpRequest = {
      name: randomString(),
      price: 25.99,
      description: 'Sample description',
      categoryIds: [categoryId],
    };

    const response = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      //.attach('image', tempFilePath)
      .field('name', createProductRequest.name)
      .field('price', createProductRequest.price)
      .field('description', createProductRequest.description!)
      .field('categoryIds[0]', createProductRequest.categoryIds![0])
      .expect(HttpStatus.CREATED);

    const body: V1CreateProductHttpResponse = response.body;

    expect(body.name).toEqual(createProductRequest.name);
    expect(body.price).toEqual(createProductRequest.price);
    expect(body.description).toEqual(createProductRequest.description);
    expect(body.categoryIds).toEqual(createProductRequest.categoryIds);
    //expect(body.imageUrl).toBeDefined();

    //uploadedTempFilePath = body.imageUrl;
  });

  // Add more test cases for other routes, if needed.
});
