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
import { CreateReviewerHttpRequest } from '@controllers/http/create-reviewer';

describe('ApproveProductHttpController (e2e)', () => {
  let app: INestApplication;
  const productsUrl = `/products`;
  const productApproveUrl = '/approve';
  const requestUrl = `${productsUrl}${productApproveUrl}`;

  const reviewersUrl = `/reviewers`;

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
      const createProductRequest: CreateProductHttpRequest = {
        name: faker.commerce.productName(),
        price: {
          amount: Number(faker.commerce.price()),
          currency: MoneyCurrencyEnum.USD,
        },
      };

      const createReviewerRequest: CreateReviewerHttpRequest = {
        name: faker.name.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: ReviewerRoleEnum.Regular,
      };

      const createProductResponse = await request(app.getHttpServer())
        .post(productsUrl)
        .set('Accept', 'application/json')
        .send(createProductRequest);

      expect(createProductResponse.status).toBe(HttpStatus.CREATED);

      const createReviewerResponse = await request(app.getHttpServer())
        .post(reviewersUrl)
        .set('Accept', 'application/json')
        .send(createReviewerRequest);

      expect(createReviewerResponse.status).toBe(HttpStatus.CREATED);
      expect(createReviewerResponse.body.role).toBe(ReviewerRoleEnum.Regular);

      const { productId } = createProductResponse.body;
      const { reviewerId } = createReviewerResponse.body;

      const approveProductRequest: ApproveProductHttpRequest = {
        productId,
        reviewerId,
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
  });

  // Add more test cases for other routes, if needed.
});
