import { ReviewerAggregate } from '@aggregates/reviewer';
import {
  ReviewerTypeOrmMapper,
  ReviewerTypeOrmModel,
} from '@database/repositories/typeorm/reviewer';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';

describe('ReviewerTypeOrmMapper', () => {
  let mapper: ReviewerTypeOrmMapper;
  const testName = 'John Doe';
  const testEmail = 'johndoe@example.com';
  const testAggregate = new ReviewerAggregate({
    details: {
      name: new ReviewerNameValueObject(testName),
      email: new ReviewerEmailValueObject(testEmail),
    },
  });

  beforeEach(() => {
    mapper = new ReviewerTypeOrmMapper(ReviewerAggregate, ReviewerTypeOrmModel);
  });

  it('should map an entity to persistence details', () => {
    const result = (mapper as any).toPersistanceDetails(testAggregate);

    expect(result).toEqual({
      name: testName,
      email: testEmail,
    });
  });

  it('should map a model to domain details', () => {
    const testModel: ReviewerTypeOrmModel = {
      id: '1',
      name: testName,
      email: testEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = (mapper as any).toDomainDetails(testModel);

    expect(result).toEqual({
      name: new ReviewerNameValueObject(testName),
      email: new ReviewerEmailValueObject(testEmail),
    });
  });

  it('should map a model to domain details with undefined values', () => {
    const testModel: ReviewerTypeOrmModel = {
      id: '1',
    } as unknown as ReviewerTypeOrmModel;

    const result = (mapper as any).toDomainDetails(testModel);

    expect(result).toEqual({
      name: undefined,
      email: undefined,
    });
  });
});
