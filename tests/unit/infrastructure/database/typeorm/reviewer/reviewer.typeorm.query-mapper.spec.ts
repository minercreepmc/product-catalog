import { ReviewerAggregateDetails } from '@aggregates/reviewer';
import { ReviewerTypeOrmQueryMapper } from '@database/repositories/typeorm/reviewer';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';

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
