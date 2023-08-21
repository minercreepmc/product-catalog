import {
  v1ApiEndpoints,
  V1GetCartHttpResponse,
  V1RegisterMemberHttpRequest,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { getCookieFromHeader, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get cart', () => {
  let app: INestApplication;
  const getCartUrl = v1ApiEndpoints.getCart;
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

  it('Should get an empty cart when register an account', async () => {
    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Okeasdasd123123+',
    };

    await request(app.getHttpServer())
      .post(registerMemberUrl)
      .set('Accept', 'application/json')
      .send(registerMemberRequest)
      .expect(HttpStatus.CREATED);

    const loginRequest: V1RegisterMemberHttpRequest = {
      username: registerMemberRequest.username,
      password: registerMemberRequest.password,
    };

    const loginResponse = await request(app.getHttpServer())
      .post(loginUrl)
      .set('Accept', 'application/json')
      .send(loginRequest)
      .expect(HttpStatus.OK);

    const getCartResponse = await request(app.getHttpServer())
      .get(getCartUrl)
      .set('Accept', 'application/json')
      .set('Cookie', getCookieFromHeader(loginResponse.header))
      .expect(HttpStatus.OK);

    const body = getCartResponse.body as V1GetCartHttpResponse;

    expect(body.items.length).toBe(0);
  });

  // Add more test cases for other routes, if needed.
});
