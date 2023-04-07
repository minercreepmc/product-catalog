import { ReviewerDomainExceptionCodes } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  CreateReviewerHttpRequest,
  CreateReviewerHttpResponse,
} from '@src/interface-adapters/controllers/http';
import { checkResponseForCode } from '@utils/functions';
import * as request from 'supertest';

describe('CreateReviewerHttpController (e2e)', () => {
  let app: INestApplication;
  const reviewersUrl = `/reviewers`;

  const createReviewerRequest: CreateReviewerHttpRequest = {
    name: 'John Doe',
    email: '6ycjc@example.com',
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

  describe(`${reviewersUrl} (POST)`, () => {
    it('should create a reviewer and return the new reviewer information', () => {
      return request(app.getHttpServer())
        .post(reviewersUrl)
        .set('Accept', 'application/json')
        .send(createReviewerRequest)
        .expect((response: request.Response) => {
          const { name, email, reviewerId } =
            response.body as CreateReviewerHttpResponse;

          expect(name).toEqual(createReviewerRequest.name);
          expect(email).toEqual(createReviewerRequest.email);
          expect(reviewerId).toBeDefined();
        })
        .expect(HttpStatus.CREATED);
    });

    it('should not create a reviewer if it already exists', async () => {
      await request(app.getHttpServer())
        .post(reviewersUrl)
        .set('Accept', 'application/json')
        .send(createReviewerRequest);

      // Attempt to create the reviewer again
      return request(app.getHttpServer())
        .post(reviewersUrl)
        .set('Accept', 'application/json')
        .send(createReviewerRequest)
        .expect((response: request.Response) => {
          const emailIsExist = checkResponseForCode({
            response,
            statusCode: HttpStatus.CONFLICT,
            codes: [ReviewerDomainExceptionCodes.DoesExist],
          });

          expect(emailIsExist).toBeTruthy();
        })
        .expect(HttpStatus.CONFLICT);
    });

    it('should not create a reviewer if the request format is not valid', async () => {
      const invalidProductRequest: CreateReviewerHttpRequest = {
        name: '',
        email: 'WTF@##@#@ple.com',
      };

      return request(app.getHttpServer())
        .post(reviewersUrl)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect((response: request.Response) => {
          const requestIsNotValid = checkResponseForCode({
            response,
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            codes: [
              ReviewerDomainExceptionCodes.NameDoesNotValid,
              ReviewerDomainExceptionCodes.EmailDoesNotValid,
            ],
          });

          expect(requestIsNotValid).toBeTruthy();
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  // Add more test cases for other routes, if needed.
});
