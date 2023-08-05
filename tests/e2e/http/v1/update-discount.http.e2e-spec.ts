import {
  v1ApiEndpoints,
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
  V1UpdateDiscountHttpRequest,
  V1UpdateDiscountHttpResponse,
} from '@api/http';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Update discount', () => {
  let app: INestApplication;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;
  const updateDiscountUrl = v1ApiEndpoints.updateDiscount;

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

  it('should update a discount and return the new discount information', async () => {
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 2,
    };
    const updateDiscountRequest: V1UpdateDiscountHttpRequest = {
      name: randomString(),
      description: 'Sample description',
    };
    const createResponse = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const createBody: V1CreateDiscountHttpResponse = createResponse.body;
    const discountId = createBody.id;

    const updateResponse = await request(app.getHttpServer())
      .put(updateDiscountUrl.replace(':id', discountId))
      .set('Accept', 'application/json')
      .send(updateDiscountRequest)
      .expect(HttpStatus.OK);

    const { name, percentage, description } =
      updateResponse.body as V1UpdateDiscountHttpResponse;
    expect(name).toEqual(updateDiscountRequest.name);
    expect(percentage).not.toEqual(updateDiscountRequest.percentage);
    expect(description).toEqual(updateDiscountRequest.description);
  });

  it('should not update a discount if it not exists', async () => {
    const discountIdDidNotExist = '123';

    const updateDiscountRequest: V1UpdateDiscountHttpRequest = {
      name: randomString(),
      description: 'Sample description',
    };
    const response = await request(app.getHttpServer())
      .put(updateDiscountUrl.replace(':id', discountIdDidNotExist))
      .set('Accept', 'application/json')
      .send(updateDiscountRequest)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new DiscountDomainExceptions.DoesNotExist(),
      ]),
    );
  });

  it('should not update a product if the request format is not valid', async () => {
    const productIdDidNotExist = '123';
    const invalidUpdateProductRequest: V1UpdateDiscountHttpRequest = {
      name: '1',
      percentage: -12,
      description: '1',
    };
    const response = await request(app.getHttpServer())
      .put(updateDiscountUrl.replace(':id', productIdDidNotExist))
      .set('Accept', 'application/json')
      .send(invalidUpdateProductRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new DiscountDomainExceptions.NameDoesNotValid(),
        new DiscountDomainExceptions.DescriptionDoesNotValid(),
        new DiscountDomainExceptions.PercentageDoesNotValid(),
        //new ProductDomainExceptions.ImageDoesNotValid(),
      ]),
    );
  });

  // Add more test cases for other routes, if needed.
});
