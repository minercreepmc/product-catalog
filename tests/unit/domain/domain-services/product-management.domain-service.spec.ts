import {
  CreateProductAggregateOptions,
  ProductAggregate,
} from '@aggregates/product';
import { ProductDomainException } from '@domain-exceptions/product';
import { ProductRepositoryPort } from '@domain-interfaces';
import {
  ProductManagementDomainService,
  UpdateProductDomainServiceOptions,
} from '@domain-services';
import { AllowableCurrencyEnum } from '@value-objects/common/money';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ProductManagementDomainService', () => {
  let service: ProductManagementDomainService;
  let mockProductRepository: MockProxy<ProductRepositoryPort>;

  beforeEach(() => {
    mockProductRepository = mock<ProductRepositoryPort>();
    service = new ProductManagementDomainService(mockProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isProductExist', () => {
    it('should return true when product exists', async () => {
      const existingProduct = new ProductAggregate();
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Existing Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };
      existingProduct.createProduct(options);

      mockProductRepository.findOneByName.mockResolvedValue(existingProduct);

      const result = await service.isProductNameExist(options.name);

      expect(result).toBe(true);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
        options.name,
      );
    });

    it('should return false when product does not exist', async () => {
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Non-existing Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      mockProductRepository.findOneByName.mockResolvedValue(null);

      const result = await service.isProductNameExist(options.name);

      expect(result).toBe(false);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
        options.name,
      );
    });
  });

  describe('createProduct', () => {
    it('should create a product and save it', async () => {
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Test Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };

      await service.createProduct(options);

      expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            name: options.name,
            price: options.price,
          }),
        }),
      );
    });
    it('should throw an exception when creating an existing product', async () => {
      const existingProduct = new ProductAggregate();
      const options: CreateProductAggregateOptions = {
        name: new ProductNameValueObject('Existing Product'),
        price: ProductPriceValueObject.create({
          amount: 100,
          currency: AllowableCurrencyEnum.USD,
        }),
      };
      existingProduct.createProduct(options);

      mockProductRepository.findOneByName.mockResolvedValue(existingProduct);

      await expect(service.createProduct(options)).rejects.toThrowError(
        new ProductDomainException.IsExist(),
      );

      expect(mockProductRepository.findOneByName).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneByName).toHaveBeenCalledWith(
        options.name,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product and save it', async () => {
      const existingProduct = new ProductAggregate();
      const productId = new ProductIdValueObject('123');
      const oldProductName = new ProductNameValueObject('Old Product');
      const newProductName = new ProductNameValueObject('New Product');
      const createOptions: CreateProductAggregateOptions = {
        name: oldProductName,
        price: ProductPriceValueObject.create({
          amount: 50,
          currency: AllowableCurrencyEnum.USD,
        }),
      };
      existingProduct.createProduct(createOptions);

      mockProductRepository.findOneById.mockResolvedValue(existingProduct);

      const updateOptions: UpdateProductDomainServiceOptions = {
        id: productId,
        payload: {
          name: newProductName,
          price: ProductPriceValueObject.create({
            amount: 50,
            currency: AllowableCurrencyEnum.USD,
          }),
        },
      };

      await service.updateProduct(updateOptions);

      expect(mockProductRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneById).toHaveBeenCalledWith(productId);

      expect(existingProduct.details.name).toEqual(updateOptions.payload.name);
      expect(existingProduct.details.price).toEqual(
        updateOptions.payload.price,
      );

      expect(mockProductRepository.save).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.save).toHaveBeenCalledWith(existingProduct);
    });

    it('should throw an exception when updating a non-existent product', async () => {
      mockProductRepository.findOneById.mockResolvedValue(null);

      const productName = new ProductNameValueObject('Old Product');
      const productId = new ProductIdValueObject('123');
      const options: UpdateProductDomainServiceOptions = {
        id: productId,
        payload: {
          name: productName,
          price: ProductPriceValueObject.create({
            amount: 50,
            currency: AllowableCurrencyEnum.USD,
          }),
        },
      };

      await expect(service.updateProduct(options)).rejects.toThrowError(
        new ProductDomainException.IsNotExist(),
      );

      expect(mockProductRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(mockProductRepository.findOneById).toHaveBeenCalledWith(productId);
    });
  });
});
