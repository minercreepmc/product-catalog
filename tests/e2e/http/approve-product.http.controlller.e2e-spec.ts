import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  generateRandomProductId,
  generateRandomReviewerId,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
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
  const productsUrl = `products`;
  const productApproveUrl = 'approve';
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

  describe(`${productsUrl} (PUT)`, () => {
    it('Should not approve product if the request is invalid', async () => {
      const approveProductRequest: ApproveProductHttpRequest = {
        reviewerId: '',
      };
      const productId = generateRandomProductId();
      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${productId}/${productApproveUrl}`)
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
      const approveProductRequest: ApproveProductHttpRequest = {
        reviewerId: generateRandomReviewerId(),
      };

      const productId = generateRandomProductId();
      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${productId}/${productApproveUrl}`)
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
      const approveProductRequest: ApproveProductHttpRequest = {
        reviewerId: regularReviewerId,
      };

      const productId = validProductId;

      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${productId}/${productApproveUrl}`)
        .set('Accept', 'application/json')
        .send(approveProductRequest);

      expect(response.body.message).toIncludeAllMembers(
        mapDomainExceptionsToObjects([
          new ReviewerDomainExceptions.NotAuthorizedToApprove(),
        ]),
      );
    });

    it('Should not approve product if product not subbmited yet', async () => {
      const approveProductRequest: ApproveProductHttpRequest = {
        reviewerId: adminReviewerId,
      };

      const productId = validProductId;

      const response = await request(app.getHttpServer())
        .put(`/${productsUrl}/${productId}/${productApproveUrl}`)
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
