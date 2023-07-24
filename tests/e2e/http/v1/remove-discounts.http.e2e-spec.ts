import {
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
} from '@controllers/http/v1/create-discount';
import { v1ApiEndpoints } from '@controllers/http/v1/endpoint.v1';
import {
  V1RemoveDiscountsHttpRequest,
  V1RemoveDiscountsHttpResponse,
} from '@controllers/http/v1/remove-discounts';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Remove discounts', () => {
  let app: INestApplication;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;
  const removeDiscountUrl = v1ApiEndpoints.removeDiscounts;
  const apiPrefix = `api/v1`;

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

  it('should not remove discounts if request is invalid', async () => {
    const removeDiscountsRequest: V1RemoveDiscountsHttpRequest = {
      ids: ['', '', ''],
    };

    await request(app.getHttpServer())
      .post(removeDiscountUrl)
      .set('Accept', 'application/json')
      .send(removeDiscountsRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('should not remove discounts if it not exist', async () => {
    const removeDiscountsRequest: V1RemoveDiscountsHttpRequest = {
      ids: Array.from({ length: 3 }, () => randomString()),
    };

    const response = await request(app.getHttpServer())
      .post(removeDiscountUrl)
      .set('Accept', 'application/json')
      .send(removeDiscountsRequest)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new DiscountDomainExceptions.DoesNotExist(),
      ]),
    );
  });

  it('should remove discounts', async () => {
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 2,
    };

    const createResponse = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const { id } = createResponse.body as V1CreateDiscountHttpResponse;

    const removeDiscountsRequest: V1RemoveDiscountsHttpRequest = {
      ids: [id],
    };

    const removedResponse = await request(app.getHttpServer())
      .post(removeDiscountUrl)
      .set('Accept', 'application/json')
      .send(removeDiscountsRequest)
      .expect(HttpStatus.OK);

    const { ids } = removedResponse.body as V1RemoveDiscountsHttpResponse;

    expect(ids).toEqual(removeDiscountsRequest.ids);
  });

  // Add more test cases for other routes, if needed.
});
