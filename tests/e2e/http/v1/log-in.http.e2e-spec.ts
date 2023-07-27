import {
  v1ApiEndpoints,
  V1LogInHttpRequest,
  V1LogInHttpResponse,
  V1RegisterMemberHttpRequest,
} from '@api/http';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Log In', () => {
  let app: INestApplication;
  const logInUrl = v1ApiEndpoints.logIn;
  const registerUrl = v1ApiEndpoints.registerMember;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should fail to sign in if either username or password is incorrect', async () => {
    const invalidRequest: V1LogInHttpRequest = {
      username: randomString(),
      password: 'okeokeoke',
    };

    const response = await request(app.getHttpServer())
      .post(logInUrl)
      .send(invalidRequest)
      .expect(HttpStatus.UNAUTHORIZED);

    const expectedExceptions = mapDomainExceptionsToObjects([
      new UserDomainExceptions.CredentialDoesNotValid(),
    ]);

    expect(response.body.message).toIncludeAllMembers(expectedExceptions);
  });

  it('should sign in successfully if email and password are correct', async () => {
    const registerRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'Password123+',
    };

    await request(app.getHttpServer())
      .post(registerUrl)
      .send(registerRequest)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post(logInUrl)
      .send(registerRequest)
      .expect(HttpStatus.OK);

    const body: V1LogInHttpResponse = response.body;

    expect(response.headers['cookie']).toBeDefined();
    expect(body.cookie).toBeDefined();
  });

  // Add more tests here

  afterEach(async () => {
    await app.close();
  });
});
