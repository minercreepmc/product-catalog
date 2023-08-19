import {
  v1ApiEndpoints,
  V1LogInAdminHttpRequest,
  V1LogInAdminHttpResponse,
  V1RegisterAdminHttpRequest,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Log In Admin', () => {
  let app: INestApplication;
  const logInUrl = v1ApiEndpoints.logInAdmin;
  const registerAdminUrl = v1ApiEndpoints.registerAdmin;
  const logOutUrl = v1ApiEndpoints.logOut;
  const apiKey = process.env.API_KEY!;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should fail to sign in if either username or password is incorrect', async () => {
    const invalidRequest: V1LogInAdminHttpRequest = {
      username: randomString(),
      password: 'okeokeoke',
    };

    await request(app.getHttpServer())
      .post(logInUrl)
      .send(invalidRequest)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should sign in successfully if email and password are correct', async () => {
    const registerRequest: V1RegisterAdminHttpRequest = {
      username: randomString(),
      password: 'Password123+',
    };

    await request(app.getHttpServer())
      .post(registerAdminUrl)
      .send(registerRequest)
      .set('X-API-Key', apiKey)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post(logInUrl)
      .set('X-API-Key', apiKey)
      .send(registerRequest)
      .expect(HttpStatus.OK);

    const body: V1LogInAdminHttpResponse = response.body;

    expect(response.headers['set-cookie']).toBeDefined();
    expect(body.cookie).toBeDefined();

    const logOutResponse = await request(app.getHttpServer())
      .post(logOutUrl)
      .expect(HttpStatus.OK);

    expect(logOutResponse.headers.cookie).toBeUndefined();
  });

  // Add more tests here

  afterEach(async () => {
    await app.close();
  });
});
