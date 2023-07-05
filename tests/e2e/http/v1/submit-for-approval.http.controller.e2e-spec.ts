import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  V1CreateProductHttpRequest,
  V1CreateProductHttpResponse,
  V1CreateReviewerHttpRequest,
  V1CreateReviewerHttpResponse,
  V1SubmitForApprovalHttpRequest,
} from '@controllers/http/v1';
import {
  generateRandomProductId,
  generateRandomProductName,
  generateRandomReviewerId,
  generateRandomReviewerName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import * as request from 'supertest';
import { SubmitForApprovalResponseDto } from '@use-cases/command/submit-for-approval/dtos';

describe('V1SubmitForApprovalHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `products`;
  const createProductUrl = 'create';
  const productSubmitUrl = 'submit';

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

  describe(`${productsUrl}/productId/${productSubmitUrl} (PUT)`, () => {
    it('Should submit product for approval', async () => {
      const createProductRequest: V1CreateProductHttpRequest = {
        name: generateRandomProductName(),
        price: {
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
        },
      };
      const productResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${productsUrl}/${createProductUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest);

      const createReviewerRequest: V1CreateReviewerHttpRequest = {
        name: generateRandomReviewerName(),
        role: ReviewerRoleEnum.Regular,
      };
      const reviewerResponse = await request(app.getHttpServer())
        .post(`/${apiPrefix}/${reviewersUrl}`)
        .set('Accept', 'application/json')
        .send(createReviewerRequest);

      const product: V1CreateProductHttpResponse = productResponse.body;
      const reviewer: V1CreateReviewerHttpResponse = reviewerResponse.body;

      const submitForApprovalRequest: V1SubmitForApprovalHttpRequest = {
        reviewerId: reviewer.id,
      };

      return request(app.getHttpServer())
        .put(
          `/${apiPrefix}/${productsUrl}/${product.productId}/${productSubmitUrl}`,
        )
        .set('Accept', 'application/json')
        .send(submitForApprovalRequest)
        .expect((response: request.Response) => {
          const { reviewerId, productId } =
            response.body as SubmitForApprovalResponseDto;

          expect(productId).toEqual(product.productId);
          expect(reviewerId).toEqual(submitForApprovalRequest.reviewerId);
        })
        .expect(HttpStatus.OK);
    });

    it('should return error exceptions if either product or reviewer is not exist', async () => {
      const invalidProductRequest: V1SubmitForApprovalHttpRequest = {
        reviewerId: generateRandomReviewerId(),
      };

      const productId = generateRandomProductId();

      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${productSubmitUrl}`)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.DoesNotExist(),
          new ReviewerDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('should not create a reviewer if the request format is not valid', async () => {
      const invalidRequest: V1SubmitForApprovalHttpRequest = {
        reviewerId: '',
      };

      const productId = generateRandomProductId();

      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${productSubmitUrl}`)
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.IdDoesNotValid(),
        ]),
      );
    });

    it('should return not found if productId is empty string due to invalid endpoint', async () => {
      const invalidProductRequest: V1SubmitForApprovalHttpRequest = {
        reviewerId: '',
      };

      const productId = '';

      await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${productSubmitUrl}`)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  // Add more test cases for other routes, if needed.
});
