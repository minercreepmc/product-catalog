import {
  CreateProductHttpRequest,
  CreateReviewerHttpRequest,
  CreateReviewerHttpResponse,
} from '@controllers/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { faker } from '@faker-js/faker';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import * as request from 'supertest';
import { RejectProductHttpRequest } from '@controllers/http/reject-product';
import { checkResponseForCode } from '@utils/functions';
import { ReviewerDomainExceptionCodes } from '@domain-exceptions/reviewer';
import { ProductDomainExceptionCodes } from '@domain-exceptions/product';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';
import { SubmitForApprovalHttpRequest } from '@controllers/http/submit-for-approval';

describe('RejectProductHttpController (PUT)', () => {
  let app: INestApplication;
  const productsUrl = `products`;
  const productRejectUrl = 'reject';
  const productSubmitUrl = 'submit';
  const reviewersUrl = `reviewers`;

  let validProductId: string;
  let regularReviewerId: string;
  let adminReviewerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const createProductRequest: CreateProductHttpRequest = {
      name: faker.commerce.productName(),
      price: {
        amount: Number(faker.commerce.price()),
        currency: MoneyCurrencyEnum.USD,
      },
    };

    const createRegularReviewerRequest: CreateReviewerHttpRequest = {
      name: faker.name.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: ReviewerRoleEnum.Regular,
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(`/${productsUrl}`)
      .set('Accept', 'application/json')
      .send(createProductRequest);

    expect(createProductResponse.status).toBe(HttpStatus.CREATED);

    const createRegularReviewerResponse = await request(app.getHttpServer())
      .post(`/${reviewersUrl}`)
      .set('Accept', 'application/json')
      .send(createRegularReviewerRequest);

    expect(createRegularReviewerResponse.status).toBe(HttpStatus.CREATED);
    expect(createRegularReviewerResponse.body.role).toBe(
      ReviewerRoleEnum.Regular,
    );

    const createAdminReviewerRequest: CreateReviewerHttpRequest = {
      name: faker.name.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: ReviewerRoleEnum.Admin,
    };

    const createAdminReviewerResponse = await request(app.getHttpServer())
      .post(`/${reviewersUrl}`)
      .set('Accept', 'application/json')
      .send(createAdminReviewerRequest);

    const { productId } = createProductResponse.body;
    const regularResponseBody: CreateReviewerHttpResponse =
      createRegularReviewerResponse.body;
    const adminResponseBody: CreateReviewerHttpResponse =
      createAdminReviewerResponse.body;

    validProductId = productId;
    regularReviewerId = regularResponseBody.reviewerId;
    adminReviewerId = adminResponseBody.reviewerId;
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`PUT ${productsUrl}/productId/${productRejectUrl}`, () => {
    it('should not reject a product if request is not valid', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: '',
        reason: 'Bad',
      };

      const rejectProductResponse = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      const commandIsNotValid = checkResponseForCode({
        response: rejectProductResponse,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        codes: [
          ReviewerDomainExceptionCodes.IdDoesNotValid,
          ProductDomainExceptionCodes.RejectionReasonDoesNotValid,
        ],
      });

      expect(commandIsNotValid).toBe(true);
    });

    it('should not reject a product if product does not exist', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: regularReviewerId,
        reason: 'Bad stuff',
      };

      const nonExistentProductId = '1';

      const rejectProductResponse = await request(app.getHttpServer())
        .put(`/${productsUrl}/${nonExistentProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      const reviewerDoesNotExist = checkResponseForCode({
        response: rejectProductResponse,
        statusCode: HttpStatus.CONFLICT,
        codes: [ProductDomainExceptionCodes.DoesNotExist],
      });

      expect(reviewerDoesNotExist).toBe(true);
    });

    it('should not reject a product if reviewer does not exist', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: 'non-existent-reviewer-id',
        reason: 'Bad stuff',
      };

      const rejectProductResponse = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      const reviewerDoesNotExist = checkResponseForCode({
        response: rejectProductResponse,
        statusCode: HttpStatus.CONFLICT,
        codes: [ProductDomainExceptionCodes.DoesNotExist],
      });

      expect(reviewerDoesNotExist).toBe(true);
    });

    it('should not reject a product if reviewer is not an admin', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: regularReviewerId,
        reason: 'Bad stuff',
      };

      const rejectProductResponse = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      const reviewerIsNotAdmin = checkResponseForCode({
        response: rejectProductResponse,
        statusCode: HttpStatus.CONFLICT,
        codes: [ReviewerDomainExceptionCodes.NotAuthorizedToReject],
      });

      expect(reviewerIsNotAdmin).toBe(true);
    });

    it('should not reject a product if product is not submitted for approval yet', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: adminReviewerId,
        reason: 'Bad stuff',
      };

      const rejectProductResponse = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      const notSubmitted = checkResponseForCode({
        response: rejectProductResponse,
        statusCode: HttpStatus.CONFLICT,
        codes: [ProductDomainExceptionCodes.NotSubmittedForApproval],
      });

      expect(notSubmitted).toBe(true);
    });

    it('should reject a product if request is valid', async () => {
      const submitProductRequest: SubmitForApprovalHttpRequest = {
        reviewerId: regularReviewerId,
      };
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: adminReviewerId,
        reason: 'Bad stuff',
      };

      await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productSubmitUrl}`)
        .set('Accept', 'application/json')
        .send(submitProductRequest)
        .expect(HttpStatus.OK);

      const rejectProductResponse = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.OK);

      const { productId } = rejectProductResponse.body;

      expect(productId).toBe(validProductId);
    });
  });
});
