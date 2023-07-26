import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import {
  V1RegisterAdminHttpRequest,
  V1RegisterAdminHttpResponse,
} from '@controllers/http/v1';
import {
  generateRandomEmail,
  generateRandomPassword,
  generateRandomUsername,
  mapDomainExceptionsToObjects,
} from '@utils/functions';
import { UserDomainExceptions } from '@domain-exceptions/user';

describe('RegisterAdminHttpController', () => {
  let app: INestApplication;
  const adminRegistrationUrl = '/api/v1/register/admin';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('it should deny admin registration if api key is incorrect', async () => {
    const incorrectApiKey = 'incorrect-api-key';
    const httpRequest: V1RegisterAdminHttpRequest = {
      email: generateRandomEmail(),
      username: generateRandomUsername(),
      password: generateRandomPassword(),
    };

    await request(app.getHttpServer())
      .post(adminRegistrationUrl)
      .set('x-api-key', incorrectApiKey)
      .send(httpRequest)
      .expect(HttpStatus.FORBIDDEN);
  });

  it('it should not register admin if request is invalid', async () => {
    const apiKey = process.env.ADMIN_API_KEY;
    const httpRequest: V1RegisterAdminHttpRequest = {
      email: '',
      username: '',
      password: '',
    };

    const response = await request(app.getHttpServer())
      .post(adminRegistrationUrl)
      .set('x-api-key', apiKey)
      .send(httpRequest)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new UserDomainExceptions.UsernameDoesNotValid(),
        new UserDomainExceptions.EmailDoesNotValid(),
        new UserDomainExceptions.PasswordDoesNotValid(),
      ]),
    );
  });

  it('should not register admin if email or username already exists', async () => {
    const apiKey = process.env.ADMIN_API_KEY;
    const httpRequest: V1RegisterAdminHttpRequest = {
      email: generateRandomEmail(),
      username: generateRandomUsername(),
      password: generateRandomPassword(),
    };

    await request(app.getHttpServer())
      .post(adminRegistrationUrl)
      .set('x-api-key', apiKey)
      .send(httpRequest)
      .expect(HttpStatus.CREATED);

    const response = await request(app.getHttpServer())
      .post(adminRegistrationUrl)
      .set('x-api-key', apiKey)
      .send(httpRequest)
      .expect(HttpStatus.CONFLICT);

    expect(response.body.message).toIncludeAllMembers(
      mapDomainExceptionsToObjects([
        new UserDomainExceptions.EmailAlreadyExists(),
        new UserDomainExceptions.UsernameAlreadyExists(),
      ]),
    );
  });

  it('should register admin', async () => {
    const apiKey = process.env.ADMIN_API_KEY;
    const httpRequest: V1RegisterAdminHttpRequest = {
      email: generateRandomEmail(),
      username: generateRandomUsername(),
      password: generateRandomPassword(),
    };

    const response = await request(app.getHttpServer())
      .post(adminRegistrationUrl)
      .set('x-api-key', apiKey)
      .send(httpRequest)
      .expect(HttpStatus.CREATED);

    const body: V1RegisterAdminHttpResponse = response.body;

    expect(body.email).toBe(httpRequest.email);
    expect(body.username).toBe(httpRequest.username);
  });

  // Add more tests here

  afterEach(async () => {
    await app.close();
  });
});
