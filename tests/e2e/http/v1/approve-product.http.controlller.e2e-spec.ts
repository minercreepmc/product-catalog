import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomProductId,
  generateRandomProductName,
  generateRandomReviewerId,
  generateRandomReviewerName,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ReviewerRoleEnum } from '@value-objects/reviewer';
import {
  V1CreateReviewerHttpRequest,
  V1CreateReviewerHttpResponse,
  V1ApproveProductHttpRequest,
  V1CreateProductHttpRequest,
} from '@controllers/http/v1';

describe('V1ApproveProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `products`;
  const createProductUrl = 'create';
  const productApproveUrl = 'approve';
  const reviewersUrl = `reviewers`;
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
        amount: Number(faker.commerce.price()),
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
      .send(createProductRequest)
      .expect(HttpStatus.CREATED);

    expect(createProductResponse.status).toBe(HttpStatus.CREATED);

    const createRegularReviewerResponse = await request(app.getHttpServer())
      .post(`/${apiPrefix}/${reviewersUrl}`)
      .set('Accept', 'application/json')
      .send(createRegularReviewerRequest)
      .expect(HttpStatus.CREATED);

    expect(createRegularReviewerResponse.status).toBe(HttpStatus.CREATED);
    expect(createRegularReviewerResponse.body.role).toBe(
      ReviewerRoleEnum.Regular,
    );

    const createAdminReviewerRequest: V1CreateReviewerHttpRequest = {
      name: generateRandomReviewerName(),
      role: ReviewerRoleEnum.Admin,
    };

    const createAdminReviewerResponse = await request(app.getHttpServer())
      .post(`/${apiPrefix}/${reviewersUrl}`)
      .set('Accept', 'application/json')
      .send(createAdminReviewerRequest)
      .expect(HttpStatus.CREATED);

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

  describe(`${productsUrl} (PUT)`, () => {
    it('Should not approve product if the request is invalid', async () => {
      const approveProductRequest: V1ApproveProductHttpRequest = {
        reviewerId: '',
      };
      const productId = generateRandomProductId();
      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${productApproveUrl}`)
        .set('Accept', 'application/json')
        .send(approveProductRequest)
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.IdDoesNotValid(),
        ]),
      );
    });

    it('Should not approve a product if the product or reviewer is not exist', async () => {
      const approveProductRequest: V1ApproveProductHttpRequest = {
        reviewerId: generateRandomReviewerId(),
      };

      const productId = generateRandomProductId();
      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${productApproveUrl}`)
        .set('Accept', 'application/json')
        .send(approveProductRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.DoesNotExist(),
          new ReviewerDomainExceptions.DoesNotExist(),
        ]),
      );
    });

    it('Should not approve a product if reviewer is not admin', async () => {
      const approveProductRequest: V1ApproveProductHttpRequest = {
        reviewerId: regularReviewerId,
      };

      const productId = validProductId;

      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${productApproveUrl}`)
        .set('Accept', 'application/json')
        .send(approveProductRequest);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.NotAuthorized(),
        ]),
      );
    });

    it('Should not approve product if product not subbmited yet', async () => {
      const approveProductRequest: V1ApproveProductHttpRequest = {
        reviewerId: adminReviewerId,
      };

      const productId = validProductId;

      const response = await request(app.getHttpServer())
        .put(`/${apiPrefix}/${productsUrl}/${productId}/${productApproveUrl}`)
        .set('Accept', 'application/json')
        .send(approveProductRequest);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ProductDomainExceptions.NotSubmittedForApproval(),
        ]),
      );
    });
  });

  // Add more test cases for other routes, if needed.
});
