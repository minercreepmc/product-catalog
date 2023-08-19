import {
  v1ApiEndpoints,
  V1RegisterAdminHttpRequest,
  V1RegisterAdminHttpResponse,
} from '@api/http';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Register Admin', () => {
  let app: INestApplication;
  let existingUsername: string;

  const registerAdminUrl = v1ApiEndpoints.registerAdmin;
  const API_KEY = process.env.API_KEY!;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should not create admin if request is invalid', async () => {
    const httpRequest: V1RegisterAdminHttpRequest = {
      username: '',
      password: '',
      fullName: '',
    };

    const response = await request(app.getHttpServer())
      .post(registerAdminUrl)
      .set('X-API-Key', API_KEY)
      .send(httpRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    const expectedExceptions = mapDomainExceptionsToObjects([
      new UserDomainExceptions.UsernameDoesNotValid(),
      new UserDomainExceptions.PasswordDoesNotValid(),
      new UserDomainExceptions.UsernameDoesNotValid(),
    ]);

    expect(response.body.message).toIncludeAllMembers(expectedExceptions);
  });

  it('should not create admin if username already exists', async () => {
    existingUsername = randomString();

    await request(app.getHttpServer())
      .post(registerAdminUrl)
      .send({
        username: existingUsername,
        password: 'asdasdas123123+AA',
      })
      .set('X-API-Key', API_KEY)
      .expect(HttpStatus.CREATED);

    const httpRequest: V1RegisterAdminHttpRequest = {
      username: existingUsername,
      password: 'asdasdas123123+AA',
    };

    const response = await request(app.getHttpServer())
      .post(registerAdminUrl)
      .send(httpRequest)
      .set('X-API-Key', API_KEY)
      .expect(HttpStatus.CONFLICT);

    const expectedExceptions = mapDomainExceptionsToObjects([
      new UserDomainExceptions.UsernameAlreadyExists(),
    ]);

    expect(response.body.message).toIncludeAllMembers(expectedExceptions);
  });

  it('should create admin', async () => {
    const httpRequest: V1RegisterAdminHttpRequest = {
      username: randomString(),
      password: 'asdasdas123123+AA',
      fullName: randomString(),
    };

    const response = await request(app.getHttpServer())
      .post(registerAdminUrl)
      .send(httpRequest)
      .set('X-API-Key', API_KEY)
      .expect(HttpStatus.CREATED);

    const body = response.body as V1RegisterAdminHttpResponse;

    expect(body.username).toBe(httpRequest.username);
    expect(body.fullName).toBe(httpRequest.fullName);
  });

  afterEach(async () => {
    await app.close();
  });
});
