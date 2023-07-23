import {
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
} from '@controllers/http/v1/create-discount';
import {
  V1UpdateDiscountHttpRequest,
  V1UpdateDiscountHttpResponse,
} from '@controllers/http/v1/update-discount';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('V1UpdateDiscountHttpController (e2e)', () => {
  let app: INestApplication;
  const discountUrl = `discount`;
  const apiPrefix = `api/v1`;

  const createDiscountRequest: V1CreateDiscountHttpRequest = {
    name: randomString(),
    percentage: 2,
  };
  const updateDiscountRequest: V1UpdateDiscountHttpRequest = {
    name: randomString(),
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

  describe(`${discountUrl} (PUT)`, () => {
    it('should update a discount and return the new discount information', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${discountUrl}`)
        .set('Accept', 'application/json')
        .send(createDiscountRequest)
        .expect(HttpStatus.CREATED);

      const createBody: V1CreateDiscountHttpResponse = createResponse.body;
      const discountId = createBody.id;
      console.log(discountId);

      const updateResponse = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${discountUrl}/${discountId}`)
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
      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${discountUrl}/${discountIdDidNotExist}`)
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
        .put(`/${apiPrefix}/${discountUrl}/${productIdDidNotExist}`)
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
  });

  // Add more test cases for other routes, if needed.
});
