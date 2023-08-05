#!/bin/bash

if [ "$#" -ne 1 ]; then
	echo "Usage: $0 <UseCaseName>"
	exit 1
fi

use_case_name="$1"
dir_name="$(echo "$use_case_name" | sed -e 's/\([A-Z]\)/-\L\1/g' -e 's/^-//')"

http_controller_file="tests/e2e/http/$dir_name.http.controller.e2e-spec.ts"

cat <<EOF >"$http_controller_file"
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('${use_case_name}HttpController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/${dir_name}')
      .expect(201);
  });

  // Add more tests here

  afterEach(async () => {
    await app.close();
  });
});
EOF

echo "HTTP Controller E2E test file created: $http_controller_file"
