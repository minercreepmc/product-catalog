import {
  v1ApiEndpoints,
  V1GetUsersHttpResponse,
  V1LogInAdminHttpRequest,
  V1LogInHttpRequest,
  V1RegisterAdminHttpRequest,
  V1RegisterMemberHttpRequest,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { getCookieFromHeader, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Get users', () => {
  let app: INestApplication;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const registerAdminUrl = v1ApiEndpoints.registerAdmin;
  const logInUrl = v1ApiEndpoints.logIn;
  const logInAdminUrl = v1ApiEndpoints.logInAdmin;
  const getUsersUrl = v1ApiEndpoints.getUsers;

  const apiKey = process.env.API_KEY!;

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

  it('should get', async () => {
    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'asdasdas123123+AA',
      fullName: randomString(),
    };

    await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(registerMemberRequest)
      .expect(HttpStatus.CREATED);

    const loginRequest: V1LogInHttpRequest = {
      username: registerMemberRequest.username,
      password: registerMemberRequest.password,
    };

    const loginResponse = await request(app.getHttpServer())
      .post(logInUrl)
      .send(loginRequest)
      .expect(HttpStatus.OK);

    const registerAdminRequest: V1RegisterAdminHttpRequest = {
      username: randomString(),
      password: 'asdasdas123123+AA',
      fullName: randomString(),
    };

    await request(app.getHttpServer())
      .post(registerAdminUrl)
      .send(registerAdminRequest)
      .set('X-API-Key', apiKey)
      .expect(HttpStatus.CREATED);

    const loginAdminRequest: V1LogInAdminHttpRequest = {
      username: registerAdminRequest.username,
      password: registerAdminRequest.password,
    };

    const loginAdminResponse = await request(app.getHttpServer())
      .post(logInAdminUrl)
      .send(loginAdminRequest)
      .expect(HttpStatus.OK);

    const getUsersResponse = await request(app.getHttpServer())
      .get(getUsersUrl)
      .set('Cookie', getCookieFromHeader(loginAdminResponse.header))
      .expect(HttpStatus.OK);

    const { users } = getUsersResponse.body as V1GetUsersHttpResponse;

    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
  });

  // Add more test cases for other routes, if needed.
});
