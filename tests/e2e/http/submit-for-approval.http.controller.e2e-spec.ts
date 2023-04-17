import { ProductDomainExceptionCodes } from '@domain-exceptions/product';
import { ReviewerDomainExceptionCodes } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  CreateProductHttpRequest,
  CreateProductHttpResponse,
  CreateReviewerHttpRequest,
  CreateReviewerHttpResponse,
} from '@src/interface-adapters/controllers/http';
import { SubmitForApprovalHttpRequest } from '@src/interface-adapters/controllers/http/submit-for-approval';
import { SubmitForApprovalResponseDto } from '@use-cases/submit-for-approval/dtos';
import { checkResponseForCode } from '@utils/functions';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import * as request from 'supertest';

describe('SubmitForApprovalHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `products`;
  const productSubmitUrl = 'submit';

  const reviewersUrl = `reviewers`;

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
      const createProductRequest: CreateProductHttpRequest = {
        name: 'Product 1',
        price: {
          amount: 100,
          currency: MoneyCurrencyEnum.USD,
        },
      };
      const productResponse = await request(app.getHttpServer())
        .post(`/${productsUrl}`)
        .set('Accept', 'application/json')
        .send(createProductRequest);

      const createReviewerRequest: CreateReviewerHttpRequest = {
        name: 'Reviewer 1',
        email: 'reviewer1@example.com',
        role: ReviewerRoleEnum.Regular,
      };
      const reviewerResponse = await request(app.getHttpServer())
        .post(`/${reviewersUrl}`)
        .set('Accept', 'application/json')
        .send(createReviewerRequest);

      const product: CreateProductHttpResponse = productResponse.body;
      const reviewer: CreateReviewerHttpResponse = reviewerResponse.body;

      const submitForApprovalRequest: SubmitForApprovalHttpRequest = {
        reviewerId: reviewer.reviewerId,
      };

      return request(app.getHttpServer())
        .put(`/${productsUrl}/${product.productId}/${productSubmitUrl}`)
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
      const invalidProductRequest: SubmitForApprovalHttpRequest = {
        reviewerId: '1',
      };

      const productId = '1';

      return request(app.getHttpServer())
        .put(`/${productsUrl}/${productId}/${productSubmitUrl}`)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect((response: request.Response) => {
          const doesNotExist = checkResponseForCode({
            response,
            statusCode: HttpStatus.CONFLICT,
            codes: [
              ProductDomainExceptionCodes.DoesNotExist,
              ReviewerDomainExceptionCodes.DoesNotExist,
            ],
          });

          expect(doesNotExist).toBeTruthy();
        })
        .expect(HttpStatus.CONFLICT);
    });

    it('should not create a reviewer if the request format is not valid', async () => {
      const invalidRequest: SubmitForApprovalHttpRequest = {
        reviewerId: '',
      };

      const productId = '1';

      return request(app.getHttpServer())
        .put(`/${productsUrl}/${productId}/${productSubmitUrl}`)
        .set('Accept', 'application/json')
        .send(invalidRequest)
        .expect((response: request.Response) => {
          const doesNotValid = checkResponseForCode({
            response,
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            codes: [ReviewerDomainExceptionCodes.IdDoesNotValid],
          });

          expect(doesNotValid).toBeTruthy();
        })
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should return not found if productId is empty string due to invalid endpoint', async () => {
      const invalidProductRequest: SubmitForApprovalHttpRequest = {
        reviewerId: '',
      };

      const productId = '';

      return request(app.getHttpServer())
        .put(`/${productsUrl}/${productId}/${productSubmitUrl}`)
        .set('Accept', 'application/json')
        .send(invalidProductRequest)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  // Add more test cases for other routes, if needed.
});
