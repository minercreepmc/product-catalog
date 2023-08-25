import {
  v1ApiEndpoints,
  V1RegisterMemberHttpRequest,
  V1RegisterMemberHttpResponse,
  V1UpdateProfileHttpRequest,
  V1UpdateProfileHttpResponse,
} from '@api/http';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { getCookieFromHeader, randomString } from '@utils/functions';
import * as request from 'supertest';

describe('Update profile', () => {
  let app: INestApplication;
  const registerMemberUrl = v1ApiEndpoints.registerMember;
  const logInUrl = v1ApiEndpoints.logIn;
  const updateProfileUrl = v1ApiEndpoints.updateProfile;

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

  it('should work', async () => {
    const registerMemberRequest: V1RegisterMemberHttpRequest = {
      username: randomString(),
      password: 'ThisisStrongPass123++',
    };

    const registerResponse = await request(app.getHttpServer())
      .post(registerMemberUrl)
      .send(registerMemberRequest)
      .set('Accept', 'application/json')
      .expect(HttpStatus.CREATED);

    const { id: userId } =
      registerResponse.body as V1RegisterMemberHttpResponse;

    const loginResponse = await request(app.getHttpServer())
      .post(logInUrl)
      .set('Accept', 'application/json')
      .send(registerMemberRequest)
      .expect(HttpStatus.OK);

    const cookie = getCookieFromHeader(loginResponse.header);

    const updateProfileRequest: V1UpdateProfileHttpRequest = {
      fullName: randomString(),
      password: 'Stillstrongpassword++11',
      address: randomString(),
    };

    const updateProfileResponse = await request(app.getHttpServer())
      .put(updateProfileUrl.replace(':id', userId))
      .set('Accept', 'application/json')
      .set('Cookie', cookie)
      .send(updateProfileRequest)
      .expect(HttpStatus.OK);

    const updateProfileBody =
      updateProfileResponse.body as V1UpdateProfileHttpResponse;

    expect(updateProfileBody.fullName).toBe(updateProfileRequest.fullName);
    expect(updateProfileBody.address).toBe(updateProfileRequest.address);
  });

  // Add more test cases for other routes, if needed.
});
