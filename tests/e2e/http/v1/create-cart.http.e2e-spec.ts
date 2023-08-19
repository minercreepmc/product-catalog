import {
  v1ApiEndpoints,
  V1CreateCartHttpRequest,
  V1CreateCartHttpResponse,
  V1RegisterMemberHttpRequest,
  V1RegisterMemberHttpResponse,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { getCookieFromHeader, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Create cart', () => {
  let app: INestApplication;
  const createCartUrl = v1ApiEndpoints.createCart;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const loginUrl = v1ApiEndpoints.logIn;

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

  it('Should create a cart', async () => {
    const memberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Okeasdasd123123+',
    };

    const res1 = await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(memberRequest)
      .set('Accept', 'application/json')
      .expect(HttpStatus.CREATED);

    const body1 = res1.body as V1RegisterMemberHttpResponse;

    expect(body1.id).toBeDefined();

    const res2 = await request(app.getHttpServer())
      .post(loginUrl)
      .set('Accept', 'application/json')
      .send(memberRequest)
      .expect(HttpStatus.OK);

    const { id: userId } = res2.body as V1RegisterMemberHttpResponse;

    const cartRequest: V1CreateCartHttpRequest = {
      userId,
    };

    const res3 = await request(app.getHttpServer())
      .post(createCartUrl)
      .send(cartRequest)
      .set('Accept', 'application/json')
      .set('Cookie', getCookieFromHeader(res2.header))
      .expect(HttpStatus.CREATED);

    const body3 = res3.body as V1CreateCartHttpResponse;

    expect(body3.id).toBeDefined();
  });
  // Add more test cases for other routes, if needed.
});
