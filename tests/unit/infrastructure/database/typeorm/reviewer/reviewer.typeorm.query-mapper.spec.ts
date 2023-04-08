import { ReviewerAggregateDetails } from '@aggregates/reviewer';
import { ReviewerTypeOrmQueryMapper } from '@database/repositories/typeorm/reviewer';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

describe('ReviewerTypeOrmQueryMapper', () => {
  let mapper: ReviewerTypeOrmQueryMapper;
  const testName = 'John Doe';
  const testEmail = 'johndoe@example.com';
  const testRole = 'regular';
  const testDetails: ReviewerAggregateDetails = {
    name: new ReviewerNameValueObject(testName),
    email: new ReviewerEmailValueObject(testEmail),
    role: new ReviewerRoleValueObject(testRole),
  };

  beforeEach(() => {
    mapper = new ReviewerTypeOrmQueryMapper();
  });

  it('should map query parameters to a where clause', () => {
    const testParams = {
      id: new ReviewerIdValueObject('1'),
      name: testDetails.name,
      email: testDetails.email,
      role: testDetails.role,
    };

    const result = mapper.toQuery(testParams);

    expect(result).toEqual({
      id: '1',
      name: testName,
      email: testEmail,
      role: testRole,
    });
  });

  it('should map query parameters with undefined values to a where clause', () => {
    const testParams = {
      id: undefined,
      name: undefined,
      email: undefined,
      role: undefined,
    };

    const result = mapper.toQuery(testParams);

    expect(result).toEqual({});
  });
});
