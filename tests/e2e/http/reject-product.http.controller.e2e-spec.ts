import {
  CreateProductHttpRequest,
  CreateReviewerHttpRequest,
  CreateReviewerHttpResponse,
} from '@controllers/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import * as request from 'supertest';
import { RejectProductHttpRequest } from '@controllers/http/reject-product';
import {
  generateRandomProductId,
  generateRandomProductName,
  generateRandomProductPrice,
  generateRandomReviewerEmail,
  generateRandomReviewerId,
  generateRandomReviewerName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ProductDomainExceptions } from '@domain-exceptions/product';
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
      name: generateRandomProductName(),
      price: {
        amount: generateRandomProductPrice(),
        currency: MoneyCurrencyEnum.USD,
      },
    };

    const createRegularReviewerRequest: CreateReviewerHttpRequest = {
      name: generateRandomReviewerName(),
      email: generateRandomReviewerEmail(),
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
      name: generateRandomReviewerName(),
      email: generateRandomReviewerEmail(),
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

      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.IdDoesNotValid(),
          new ProductDomainExceptions.RejectionReasonDoesNotValid(),
        ]),
      );
    });

    it('should not reject a product if product does not exist', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: regularReviewerId,
        reason: 'Bad stuff',
      };

      const nonExistentProductId = generateRandomProductId();

      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${nonExistentProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('should not reject a product if reviewer does not exist', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: generateRandomReviewerId(),
        reason: 'Bad stuff',
      };

      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('should not reject a product if reviewer is not an admin', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: regularReviewerId,
        reason: 'Bad stuff',
      };

      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.NotAuthorizedToReject(),
        ]),
      );
    });

    it('should not reject a product if product is not submitted for approval yet', async () => {
      const rejectProductRequest: RejectProductHttpRequest = {
        reviewerId: adminReviewerId,
        reason: 'Bad stuff',
      };

      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${validProductId}/${productRejectUrl}`)
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.NotSubmittedForApproval(),
        ]),
      );
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
