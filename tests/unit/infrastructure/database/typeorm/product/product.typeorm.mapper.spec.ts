import { ProductAggregate } from '@aggregates/product';
import {
  ProductTypeOrmMapper,
  ProductTypeOrmModel,
} from '@database/repositories/typeorm/product';
import { AllowableCurrencyEnum } from '@value-objects/common/money';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductStatusEnum,
  ProductStatusValueObject,
} from '@value-objects/product';
import { DateVO, ID } from 'common-base-classes';

describe('ProductTypeOrmMapper', () => {
  let mapper: ProductTypeOrmMapper;

  beforeEach(() => {
    mapper = new ProductTypeOrmMapper(ProductAggregate, ProductTypeOrmModel);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('toPersistanceDetails', () => {
    it('should return orm model details from domain entity', () => {
      // Arrange
      const currentTime = DateVO.now();
      const entity = new ProductAggregate({
        id: new ID('123'),
        details: {
          name: new ProductNameValueObject('Product 1'),
          price: ProductPriceValueObject.create({
            amount: 10,
            currency: 'USD',
          }),
          description: null,
          image: null,
          attributes: null,
          status: ProductStatusValueObject.draft(),
          submittedBy: null,
          approvedBy: null,
          rejectedBy: null,
          rejectionReason: null,
        },
        createdAt: currentTime,
        updatedAt: currentTime,
      });

      // Act
      const result = (mapper as any).toPersistanceDetails(entity);

      // Assert
      expect(result).toEqual({
        name: 'Product 1',
        price: { amount: 10, currency: 'USD' },
        description: undefined,
        image: undefined,
        attributes: undefined,
        status: ProductStatusEnum.DRAFT,
        submittedBy: undefined,
        approvedBy: undefined,
        rejectedBy: undefined,
        rejectionReason: undefined,
      });
    });
  });

  describe('toDomainDetails', () => {
    it('should return domain entity details from orm model', () => {
      // Arrange
      const currentDate = new Date(Date.now());
      jest.setSystemTime(currentDate);
      const ormModel = new ProductTypeOrmModel({
        id: '123',
        name: 'Product 1',
        price: {
          amount: 10,
          currency: 'USD',
        },
        status: ProductStatusEnum.DRAFT,
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      // Act
      const result = (mapper as any).toDomainDetails(ormModel);

      // Assert
      expect(result).toEqual({
        name: new ProductNameValueObject('Product 1'),
        price: ProductPriceValueObject.create({
          amount: 10,
          currency: 'USD',
        }),
        description: undefined,
        image: undefined,
        attributes: undefined,
        status: ProductStatusValueObject.draft(),
        submittedBy: undefined,
        approvedBy: undefined,
        rejectedBy: undefined,
        rejectionReason: undefined,
      });
    });
  });

  describe('toPersistance', () => {
    it('should return orm model from domain entity', () => {
      // Arrange
      const currentDate = DateVO.now();
      const entity = new ProductAggregate({
        id: new ID('123'),
        details: {
          name: new ProductNameValueObject('Product 1'),
          price: ProductPriceValueObject.create({
            amount: 10,
            currency: 'USD',
          }),
          description: null,
          image: null,
          attributes: null,
          status: ProductStatusValueObject.draft(),
          submittedBy: null,
          approvedBy: null,
          rejectedBy: null,
          rejectionReason: null,
        },
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      // Act
      const result = mapper.toPersistance(entity);

      // Assert
      expect(result).toEqual(
        new ProductTypeOrmModel({
          id: '123',
          name: 'Product 1',
          price: { amount: 10, currency: 'USD' },
          status: ProductStatusEnum.DRAFT,
          createdAt: currentDate.unpack(),
          updatedAt: currentDate.unpack(),
        }),
      );
    });
  });

  describe('toDomain', () => {
    it('should return domain entity from orm model', () => {
      // Arrange
      const currentDate = new Date(Date.now());
      jest.setSystemTime(currentDate);
      const ormModel = new ProductTypeOrmModel({
        id: '123',
        name: 'Product 1',
        status: ProductStatusEnum.DRAFT,
        price: {
          amount: 10,
          currency: AllowableCurrencyEnum.USD,
        },
        createdAt: currentDate,
        updatedAt: currentDate,
      });

      // Act
      const result = mapper.toDomain(ormModel);

      // Assert
      expect(result).toBeInstanceOf(ProductAggregate);
      expect(result.id.unpack()).toEqual('123');
      expect(result.details).toEqual({
        name: new ProductNameValueObject('Product 1'),
        price: ProductPriceValueObject.create({
          amount: 10,
          currency: 'USD',
        }),
        description: undefined,
        image: undefined,
        attributes: undefined,
        status: ProductStatusValueObject.draft(),
        submittedBy: undefined,
        approvedBy: undefined,
        rejectedBy: undefined,
        rejectionReason: undefined,
      });
      expect(result.createdAt).toEqual(DateVO.create(currentDate));
      expect(result.updatedAt).toEqual(DateVO.create(currentDate));
    });
  });
});
