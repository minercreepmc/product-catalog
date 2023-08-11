import {
  v1ApiEndpoints,
  V1CreateCartHttpRequest,
  V1CreateCartHttpResponse,
  V1RegisterMemberHttpRequest,
  V1RegisterMemberHttpResponse,
} from '@api/http';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Create cart', () => {
  let app: INestApplication;
  const createCartUrl = v1ApiEndpoints.createCart;
  const registerMember = v1ApiEndpoints.registerMember;

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

  it('Should not create a cart if user is not exist', async () => {
    const createCartRequest: V1CreateCartHttpRequest = {
      userId: '12345',
    };
    const res = await request(app.getHttpServer())
      .post(createCartUrl)
      .send(createCartRequest)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(res.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new UserDomainExceptions.CredentialDoesNotValid(),
      ]),
    );
  });

  it('Should create a cart', async () => {
    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Oke123123+++',
    };

    const res = await request(app.getHttpServer())
      .post(registerMember)
      .send(registerMemberRequest)
      .expect(HttpStatus.CREATED);

    const { id: userId } = res.body as V1RegisterMemberHttpResponse;

    const createCartRequest: V1CreateCartHttpRequest = {
      userId,
    };

    const res2 = await request(app.getHttpServer())
      .post(createCartUrl)
      .send(createCartRequest)
      .expect(HttpStatus.CREATED);

    const body2 = res2.body as V1CreateCartHttpResponse;

    expect(body2.id).toBeDefined();
    expect(body2.userId).toBe(userId);
  });
  // Add more test cases for other routes, if needed.
});
