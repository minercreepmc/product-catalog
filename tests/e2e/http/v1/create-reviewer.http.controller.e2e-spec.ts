import {
  V1CreateReviewerHttpRequest,
  V1CreateReviewerHttpResponse,
} from '@controllers/http/v1';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomReviewerEmail,
  generateRandomReviewerName,
  generateRandomReviewerPassword,
  generateRandomReviewerUsername,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import * as request from 'supertest';

describe('V1CreateReviewerHttpController (e2e)', () => {
  let app: INestApplication;
  const reviewersUrl = `reviewers`;
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

  describe(`${reviewersUrl} (POST)`, () => {
    it('should create a reviewer and return the new reviewer information', async () => {
      const createReviewerRequest: V1CreateReviewerHttpRequest = {
        name: generateRandomReviewerName(),
        email: generateRandomReviewerEmail(),
        password: generateRandomReviewerPassword(),
        username: generateRandomReviewerUsername(),
        role: ReviewerRoleEnum.Regular,
      };
      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${reviewersUrl}`)
        .set('Accept', 'application/json')
        .send(createReviewerRequest)
        .expect(HttpStatus.CREATED);

      const { name, /**email,**/ reviewerId, role } =
        response.body as V1CreateReviewerHttpResponse;

      expect(name).toEqual(createReviewerRequest.name);
      //expect(email).toEqual(createReviewerRequest.email);
      expect(role).toEqual(createReviewerRequest.role);
      expect(reviewerId).toBeDefined();
    });

    it('should not create a reviewer if name already exists', async () => {
      const existNameRequest: V1CreateReviewerHttpRequest = {
        name: generateRandomReviewerName(),
        email: generateRandomReviewerEmail(),
        password: generateRandomReviewerPassword(),
        username: generateRandomReviewerUsername(),
        role: ReviewerRoleEnum.Regular,
      };

      await request(app.getHttpServer())
        .post(`/${apiPrefix}/${reviewersUrl}`)
        .set('Accept', 'application/json')
        .send(existNameRequest)
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${reviewersUrl}`)
        .set('Accept', 'application/json')
        .send(existNameRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.DoesExist(),
        ]),
      );
    });

    it('should not create a reviewer if the request format is not valid', async () => {
      // TODO: It should return other domain exceptions too, since it belong to other microservices
      const invalidProductRequest: V1CreateReviewerHttpRequest = {
        name: '',
        email: 'WTF@##@#@ple.com',
        username: '',
        password: '',
        role: '' as ReviewerRoleEnum,
      };

      const response = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${reviewersUrl}`)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.NameDoesNotValid(),
          new ReviewerDomainExceptions.RoleDoesNotValid(),
        ]),
      );
    });
  });

  // Add more test cases for other routes, if needed.
});
