import {
  v1ApiEndpoints,
  V1LogInHttpRequest,
  V1RegisterMemberHttpRequest,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { LogInResponseDto } from '@use-cases/command/log-in';
import { randomString } from '@utils/functions';
import * as request from 'supertest';
import  

describe('Get user profile', () => {
  let app: INestApplication;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const logInUrl = v1ApiEndpoints.logIn;
  const getProfileUrl = v1ApiEndpoints.getProfile;

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
      .expect(HttpStatus.CREATED);

    expect(loginResponse.headers['set-cookie']).toBeDefined();

    const { cookie } = loginResponse.body as LogInResponseDto;

    const id =  

    const response = await request(app.getHttpServer())
      .get(getProfileUrl)
      .expect(HttpStatus.OK);
  });

  // Add more test cases for other routes, if needed.
});
