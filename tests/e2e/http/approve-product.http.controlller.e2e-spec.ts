import { ProductDomainExceptionCodes } from '@domain-exceptions/product';
import { ReviewerDomainExceptionCodes } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { checkResponseForCode } from '@utils/functions';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import { ApproveProductHttpRequest } from '@controllers/http/approve-product';
import { CreateProductHttpRequest } from '@controllers/http/create-product';
import {
  CreateReviewerHttpRequest,
  CreateReviewerHttpResponse,
} from '@controllers/http/create-reviewer';

describe('ApproveProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `/products`;
  const productApproveUrl = '/approve';
  const requestUrl = `${productsUrl}${productApproveUrl}`;
  const reviewersUrl = `/reviewers`;

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
      .post(productsUrl)
      .set('Accept', 'application/json')
      .send(createProductRequest);

    expect(createProductResponse.status).toBe(HttpStatus.CREATED);

    const createRegularReviewerResponse = await request(app.getHttpServer())
      .post(reviewersUrl)
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
      .post(reviewersUrl)
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

  describe(`${productsUrl} (POST)`, () => {
    it('Should not approve product if the request is invalid', async () => {
      const approveProductRequest: ApproveProductHttpRequest = {
        productId: '',
        reviewerId: '',
      };
      const response = await request(app.getHttpServer())
        .post(requestUrl)
        .set('Accept', 'application/json')
        .send(approveProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      const requestIsInvalid = checkResponseForCode({
        response,
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        codes: [
          ProductDomainExceptionCodes.IdDoesNotValid,
          ReviewerDomainExceptionCodes.IdDoesNotValid,
        ],
      });

      expect(requestIsInvalid).toBe(true);
    });

    it('Should not approve a product if the product or reviewer is not exist', async () => {
      const approveProductRequest: ApproveProductHttpRequest = {
        productId: '1',
        reviewerId: '1',
      };
      const response = await request(app.getHttpServer())
        .post(requestUrl)
        .set('Accept', 'application/json')
        .send(approveProductRequest)
        .expect(HttpStatus.CONFLICT);

      const isNotExist = checkResponseForCode({
        response,
        statusCode: HttpStatus.CONFLICT,
        codes: [
          ProductDomainExceptionCodes.DoesNotExist,
          ReviewerDomainExceptionCodes.DoesNotExist,
        ],
      });

      expect(isNotExist).toBe(true);
    });

    it('Should not approve a product if reviewer is not admin', async () => {
      const approveProductRequest: ApproveProductHttpRequest = {
        productId: validProductId,
        reviewerId: regularReviewerId,
      };

      const response = await request(app.getHttpServer())
        .post(requestUrl)
        .set('Accept', 'application/json')
        .send(approveProductRequest);

      const isNotAdmin = checkResponseForCode({
        response,
        statusCode: HttpStatus.CONFLICT,
        codes: [ReviewerDomainExceptionCodes.NotAuthorizedToApprove],
      });

      expect(isNotAdmin).toBe(true);
    });

    it('Should not approve product if product not subbmited yet', async () => {
      const approveProductRequest: ApproveProductHttpRequest = {
        productId: validProductId,
        reviewerId: adminReviewerId,
      };

      const response = await request(app.getHttpServer())
        .post(requestUrl)
        .set('Accept', 'application/json')
        .send(approveProductRequest);

      const isNotSubmited = checkResponseForCode({
        response,
        statusCode: HttpStatus.CONFLICT,
        codes: [ProductDomainExceptionCodes.NotSubmittedForApproval],
      });

      expect(isNotSubmited).toBe(true);
    });
  });

  // Add more test cases for other routes, if needed.
});
