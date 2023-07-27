import {
  v1ApiEndpoints,
  V1CreateDiscountHttpRequest,
  V1CreateDiscountHttpResponse,
} from '@api/http';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Create discount', () => {
  let app: INestApplication;
  const createDiscountUrl = v1ApiEndpoints.createDiscount;

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

  it('Should not create a discount if the request is invalid', async () => {
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: '1',
      description: '1',
      percentage: -1,
    };
    const response = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new DiscountDomainExceptions.NameDoesNotValid(),
        new DiscountDomainExceptions.DescriptionDoesNotValid(),
        new DiscountDomainExceptions.PercentageDoesNotValid(),
      ]),
    );
  });

  it('Should not create a discount if the discount name already exists', async () => {
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 2,
      description: randomString(),
    };

    await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new DiscountDomainExceptions.AlreadyExist(),
      ]),
    );
  });

  it('Should create a discount if the request is valid', async () => {
    const createDiscountRequest: V1CreateDiscountHttpRequest = {
      name: randomString(),
      percentage: 2,
      description: randomString(),
    };

    const response = await request(app.getHttpServer())
      .post(createDiscountUrl)
      .set('Accept', 'application/json')
      .send(createDiscountRequest)
      .expect(HttpStatus.CREATED);

    const { name, description, percentage }: V1CreateDiscountHttpResponse =
      response.body;

    expect(name).toBe(createDiscountRequest.name);
    expect(description).toBe(createDiscountRequest.description);
    expect(percentage).toBe(createDiscountRequest.percentage);
  });

  // Add more test cases for other routes, if needed.
});
