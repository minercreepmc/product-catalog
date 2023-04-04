import { ReviewerAggregateDetails } from '@reviewer-domain/aggregate';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';
import { ReviewerTypeOrmQueryMapper } from '@reviewer-infrastructure/database/repositories/typeorm';

describe('ReviewerTypeOrmQueryMapper', () => {
  let mapper: ReviewerTypeOrmQueryMapper;
  const testName = 'John Doe';
  const testEmail = 'johndoe@example.com';
  const testDetails: ReviewerAggregateDetails = {
    name: new ReviewerNameValueObject(testName),
    email: new ReviewerEmailValueObject(testEmail),
  };

  beforeEach(() => {
    mapper = new ReviewerTypeOrmQueryMapper();
  });

  it('should map query parameters to a where clause', () => {
    const testParams = {
      id: new ReviewerIdValueObject('1'),
      name: testDetails.name,
      email: testDetails.email,
    };

    const result = mapper.toQuery(testParams);

    expect(result).toEqual({
      id: '1',
      name: testName,
      email: testEmail,
    });
  });

  it('should map query parameters with undefined values to a where clause', () => {
    const testParams = {
      id: undefined,
      name: undefined,
      email: undefined,
    };

    const result = mapper.toQuery(testParams);

    expect(result).toEqual({});
  });
});
