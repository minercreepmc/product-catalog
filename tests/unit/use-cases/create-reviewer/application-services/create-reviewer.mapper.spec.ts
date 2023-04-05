import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { CreateReviewerDomainServiceOptions } from '@domain-services';
import { CreateReviewerMapper } from '@use-cases/create-reviewer/application-services';
import {
  CreateReviewerCommand,
  CreateReviewerResponseDto,
} from '@use-cases/create-reviewer/dtos';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';

describe('CreateReviewerMapper', () => {
  let createReviewerMapper: CreateReviewerMapper;
  const createReviewerCommand: CreateReviewerCommand = {
    name: 'John Doe',
    email: 'johndoe@example.com',
  };
  const createReviewerDomainServiceOptions: CreateReviewerDomainServiceOptions =
    {
      name: new ReviewerNameValueObject('John Doe'),
      email: new ReviewerEmailValueObject('johndoe@example.com'),
    };
  const reviewerCreatedDomainEvent: ReviewerCreatedDomainEvent =
    new ReviewerCreatedDomainEvent({
      reviewerId: new ReviewerIdValueObject(),
      details: {
        name: new ReviewerNameValueObject('John Doe'),
        email: new ReviewerEmailValueObject('johndoe@example.com'),
      },
    });
  const createReviewerResponseDto: CreateReviewerResponseDto = {
    reviewerId: reviewerCreatedDomainEvent.reviewerId.unpack(),
    name: reviewerCreatedDomainEvent.details.name.unpack(),
    email: reviewerCreatedDomainEvent.details.email.unpack(),
  };

  beforeEach(() => {
    createReviewerMapper = new CreateReviewerMapper();
  });

  describe('toDomain', () => {
    it('should map a CreateReviewerCommand to CreateReviewerDomainServiceOptions', () => {
      const result = createReviewerMapper.toDomain(createReviewerCommand);

      expect(result).toEqual(createReviewerDomainServiceOptions);
    });
  });

  describe('toResponseDto', () => {
    it('should map a ReviewerCreatedDomainEvent to CreateReviewerResponseDto', () => {
      const result = createReviewerMapper.toResponseDto(
        reviewerCreatedDomainEvent,
      );

      expect(result).toEqual(createReviewerResponseDto);
    });
  });
});
