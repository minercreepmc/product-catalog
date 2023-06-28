import {
  V1CreateReviewerHttpRequest,
  V1CreateReviewerHttpResponse,
} from '@controllers/http/v1';
import { V1RemoveReviewerHttpRequest } from '@controllers/http/v1/remove-reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomReviewerEmail,
  generateRandomReviewerId,
  generateRandomReviewerName,
  generateRandomReviewerPassword,
  generateRandomReviewerUsername,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import * as request from 'supertest';

describe('V1RemoveReviewerHttpController (e2e)', () => {
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

  describe(`/${apiPrefix}/${reviewersUrl}/:id (PUT)`, () => {
    it('shoud not remove reviewer if reviewer does not exist', async () => {
      const nonExistReviewerId = generateRandomReviewerId();
      const removeReviewerRequest: V1RemoveReviewerHttpRequest = {};

      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${reviewersUrl}/${nonExistReviewerId}`)
        .send(removeReviewerRequest)
        .set('Accept', 'application/json')
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('should remove reviewer if reviewer exist', async () => {
      const createReviewerRequest: V1CreateReviewerHttpRequest = {
        name: generateRandomReviewerName(),
        role: ReviewerRoleEnum.Regular,
      };

      const createReviewerResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${reviewersUrl}`)
        .send(createReviewerRequest)
        .expect(HttpStatus.CREATED);

      const { id: reviewerId } =
        createReviewerResponse.body as V1CreateReviewerHttpResponse;

      const removeReviewerRequest: V1RemoveReviewerHttpRequest = {};

      await request(app.getHttpServer())
        .put(`/${apiPrefix}/${reviewersUrl}/${reviewerId}`)
        .send(removeReviewerRequest)
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
    });
  });
});
