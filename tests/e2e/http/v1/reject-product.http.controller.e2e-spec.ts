import {
  V1CreateProductHttpRequest,
  V1CreateReviewerHttpRequest,
  V1CreateReviewerHttpResponse,
  V1RejectProductHttpRequest,
  V1SubmitForApprovalHttpRequest,
} from '@controllers/http/v1';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import * as request from 'supertest';
import {
  generateRandomProductId,
  generateRandomProductName,
  generateRandomProductPrice,
  generateRandomReviewerId,
  generateRandomReviewerName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ProductDomainExceptions } from '@domain-exceptions/product';

describe('V1RejectProductHttpController (PUT)', () => {
  let app: INestApplication;
  const productsUrl = `products`;
  const createProductUrl = 'create';
  const productRejectUrl = 'reject';
  const productSubmitUrl = 'submit';
  const reviewersUrl = `reviewers`;
  const createReviewerUrl = 'create';
  const apiPrefix = `api/v1`;

  let validProductId: string;
  let regularReviewerId: string;
  let adminReviewerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const createProductRequest: V1CreateProductHttpRequest = {
      name: generateRandomProductName(),
      price: {
        amount: generateRandomProductPrice(),
        currency: MoneyCurrencyEnum.USD,
      },
    };

    const createRegularReviewerRequest: V1CreateReviewerHttpRequest = {
      name: generateRandomReviewerName(),
      role: ReviewerRoleEnum.Regular,
    };

    const createProductResponse = await request(app.getHttpServer())
      .post(`/${apiPrefix}/${productsUrl}/${createProductUrl}`)
      .set('Accept', 'application/json')
      .send(createProductRequest);

    expect(createProductResponse.status).toBe(HttpStatus.CREATED);

    const createRegularReviewerResponse = await request(app.getHttpServer())
      .post(`/${apiPrefix}/${reviewersUrl}/${createReviewerUrl}`)
      .set('Accept', 'application/json')
      .send(createRegularReviewerRequest);

    expect(createRegularReviewerResponse.status).toBe(HttpStatus.CREATED);
    expect(createRegularReviewerResponse.body.role).toBe(
      ReviewerRoleEnum.Regular,
    );

    const createAdminReviewerRequest: V1CreateReviewerHttpRequest = {
      name: generateRandomReviewerName(),
      role: ReviewerRoleEnum.Admin,
    };

    const createAdminReviewerResponse = await request(app.getHttpServer())
      .post(`/${apiPrefix}/${reviewersUrl}/${createReviewerUrl}`)
      .set('Accept', 'application/json')
      .send(createAdminReviewerRequest);

    const { productId } = createProductResponse.body;
    const regularResponseBody: V1CreateReviewerHttpResponse =
      createRegularReviewerResponse.body;
    const adminResponseBody: V1CreateReviewerHttpResponse =
      createAdminReviewerResponse.body;

    validProductId = productId;
    regularReviewerId = regularResponseBody.id;
    adminReviewerId = adminResponseBody.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`PUT ${productsUrl}/productId/${productRejectUrl}`, () => {
    it('should not reject a product if request is not valid', async () => {
      const rejectProductRequest: V1RejectProductHttpRequest = {
        reviewerId: '',
        reason: 'Bad',
      };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${validProductId}/${productRejectUrl}`,
        )
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
      const rejectProductRequest: V1RejectProductHttpRequest = {
        reviewerId: regularReviewerId,
        reason: 'Bad stuff',
      };

      const nonExistentProductId = generateRandomProductId();

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${nonExistentProductId}/${productRejectUrl}`,
        )
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
      const rejectProductRequest: V1RejectProductHttpRequest = {
        reviewerId: generateRandomReviewerId(),
        reason: 'Bad stuff',
      };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${validProductId}/${productRejectUrl}`,
        )
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
      const rejectProductRequest: V1RejectProductHttpRequest = {
        reviewerId: regularReviewerId,
        reason: 'Bad stuff',
      };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${validProductId}/${productRejectUrl}`,
        )
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.NotAuthorized(),
        ]),
      );
    });

    it('should not reject a product if product is not submitted for approval yet', async () => {
      const rejectProductRequest: V1RejectProductHttpRequest = {
        reviewerId: adminReviewerId,
        reason: 'Bad stuff',
      };

      const response = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${validProductId}/${productRejectUrl}`,
        )
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
      const submitProductRequest: V1SubmitForApprovalHttpRequest = {
        reviewerId: regularReviewerId,
      };
      const rejectProductRequest: V1RejectProductHttpRequest = {
        reviewerId: adminReviewerId,
        reason: 'Bad stuff',
      };

      await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${validProductId}/${productSubmitUrl}`,
        )
        .set('Accept', 'application/json')
        .send(submitProductRequest)
        .expect(HttpStatus.OK);

      const rejectProductResponse = await request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${validProductId}/${productRejectUrl}`,
        )
        .set('Accept', 'application/json')
        .send(rejectProductRequest)
        .expect(HttpStatus.OK);

      const { productId } = rejectProductResponse.body;

      expect(productId).toBe(validProductId);
    });
  });
});
