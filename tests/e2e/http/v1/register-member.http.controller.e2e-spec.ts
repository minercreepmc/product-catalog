import {
  v1ApiEndpoints,
  V1RegisterMemberHttpRequest,
  V1RegisterMemberHttpResponse,
} from '@api/http';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { mapDomainExceptionsToObjects, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('RegisterMemberHttpController', () => {
  let app: INestApplication;
  let existingUsername: string;

  const registerMemberUrl = v1ApiEndpoints.registerMember;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should not create member if request is invalid', async () => {
    const httpRequest: V1RegisterMemberHttpRequest = {
      username: '',
      password: '',
      fullName: '',
    };

    const response = await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(httpRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    const expectedExceptions = mapDomainExceptionsToObjects([
      new UserDomainExceptions.UsernameDoesNotValid(),
      new UserDomainExceptions.PasswordDoesNotValid(),
      new UserDomainExceptions.UsernameDoesNotValid(),
    ]);

    expect(response.body.message).toIncludeAllMembers(expectedExceptions);
  });

  it('should not create member if username already exists', async () => {
    existingUsername = randomString();

    await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send({
        username: existingUsername,
        password: 'asdasdas123123+AA',
      })
      .expect(HttpStatus.CREATED);

    const httpRequest: V1RegisterMemberHttpRequest = {
      username: existingUsername,
      password: 'asdasdas123123+AA',
    };

    const response = await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(httpRequest)
      .expect(HttpStatus.CONFLICT);

    const expectedExceptions = mapDomainExceptionsToObjects([
      new UserDomainExceptions.UsernameAlreadyExists(),
    ]);

    expect(response.body.message).toIncludeAllMembers(expectedExceptions);
  });

  it('should create member', async () => {
    const httpRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'asdasdas123123+AA',
      fullName: randomString(),
    };

    const response = await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(httpRequest)
      .expect(HttpStatus.CREATED);

    const body = response.body as V1RegisterMemberHttpResponse;

    expect(body.username).toBe(httpRequest.username);
    expect(body.fullName).toBe(httpRequest.fullName);
  });

  afterEach(async () => {
    await app.close();
  });
});
