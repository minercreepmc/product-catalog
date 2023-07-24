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
import { v1ApiEndpoints } from '@controllers/http/v1/endpoint.v1';

describe('Update product', () => {
  let app: INestApplication;
  const createProductUrl = v1ApiEndpoints.createProduct;
  const updateProductUrl = v1ApiEndpoints.updateProduct;

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

  it('should update a product and return the new product information', async () => {
    const createResponse = await request(app.getHttpServer())
      .post(createProductUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    const createBody: V1CreateProductHttpResponse = createResponse.body;
    const productId = createBody.id;

    const updateResponse = await request(app.getHttpServer())
      .put(updateProductUrl.replace(':id', productId))
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
    const productIdDidNotExist = '123';
    const response = await request(app.getHttpServer())
      .put(updateProductUrl.replace(':id', productIdDidNotExist))
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
      .put(updateProductUrl.replace(':id', productIdDidNotExist))
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

  // Add more test cases for other routes, if needed.
});
