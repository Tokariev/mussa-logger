import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CarSpecService } from './car-spec.service';
import { Car } from '../schemas/car.schema';
import { CarSpec } from '../schemas/car-spec.schema';

describe('CarSpecService', () => {
  let service: CarSpecService;
  let carModel: any;
  let carSpecsModel: any;
  let mockCarSpecInstance: any;

  beforeEach(async () => {
    mockCarSpecInstance = { save: jest.fn() };

    const MockCarSpecModel: any = jest
      .fn()
      .mockImplementation(() => mockCarSpecInstance);
    MockCarSpecModel.findOne = jest.fn();
    MockCarSpecModel.findOneAndUpdate = jest.fn();
    MockCarSpecModel.deleteMany = jest.fn();
    MockCarSpecModel.aggregate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarSpecService,
        {
          provide: getModelToken(Car.name),
          useValue: {
            findById: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(CarSpec.name),
          useValue: MockCarSpecModel,
        },
      ],
    }).compile();

    service = module.get<CarSpecService>(CarSpecService);
    carModel = module.get(getModelToken(Car.name));
    carSpecsModel = module.get(getModelToken(CarSpec.name));
  });

  // ─── createCarSpec ─────────────────────────────────────────────────────────

  describe('createCarSpec', () => {
    const dto = {
      carUUID: 'car-uuid-1',
      externalCarId: 'ext-1',
      brand: 'BMW',
      model: '3 Series',
    } as any;

    it('should throw an error if the referenced car does not exist', async () => {
      carModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.createCarSpec(dto)).rejects.toThrow(
        `Car with ID ${dto.carUUID} not found`,
      );
      expect(mockCarSpecInstance.save).not.toHaveBeenCalled();
    });

    it('should return the existing spec without inserting a new one', async () => {
      const spec = { ...dto, _id: 'spec-id-1' };
      carModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'car-uuid-1' }),
      });
      carSpecsModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(spec),
      });

      const result = await service.createCarSpec(dto);

      expect(carSpecsModel.findOneAndUpdate).toHaveBeenCalledWith(
        { carUUID: dto.carUUID },
        { $setOnInsert: dto },
        { upsert: true, new: true },
      );
      expect(result).toEqual(spec);
    });

    it('should not call save on any model instance', async () => {
      carModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'car-uuid-1' }),
      });
      carSpecsModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...dto }),
      });

      await service.createCarSpec(dto);

      expect(mockCarSpecInstance.save).not.toHaveBeenCalled();
    });
  });

  // ─── findCarSpecByExternalCarId ────────────────────────────────────────────

  describe('findCarSpecByExternalCarId', () => {
    it('should find the most recent spec by externalCarId', async () => {
      const mockSpec = { externalCarId: 'ext-1', brand: 'BMW' };
      const mockQuery = {
        lean: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockSpec),
      };
      carSpecsModel.findOne.mockReturnValue(mockQuery);

      const result = await service.findCarSpecByExternalCarId('ext-1');

      expect(carSpecsModel.findOne).toHaveBeenCalledWith({ externalCarId: 'ext-1' });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockSpec);
    });

    it('should return null when no spec exists for the externalCarId', async () => {
      const mockQuery = {
        lean: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };
      carSpecsModel.findOne.mockReturnValue(mockQuery);

      const result = await service.findCarSpecByExternalCarId('ext-unknown');

      expect(result).toBeNull();
    });
  });

  // ─── findCarsBySpecifications ──────────────────────────────────────────────

  describe('findCarsBySpecifications', () => {
    function setupAggregation(specs: any[], cars: any[]) {
      carSpecsModel.aggregate.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(specs),
        }),
      });
      carModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(cars),
      });
    }

    it('should return matching cars with total count', async () => {
      const specs = [{ carUUID: 'car-id-1' }, { carUUID: 'car-id-2' }];
      const cars = [
        { externalCarId: 'ext-1', brand: 'BMW' },
        { externalCarId: 'ext-2', brand: 'Audi' },
      ];
      setupAggregation(specs, cars);

      const result = await service.findCarsBySpecifications({ brand: 'BMW' } as any);

      expect(result).toEqual({ total: 2, cars });
    });

    it('should query cars using the carUUIDs from aggregation results', async () => {
      const specs = [{ carUUID: 'car-id-1' }, { carUUID: 'car-id-2' }];
      setupAggregation(specs, []);

      await service.findCarsBySpecifications({} as any);

      const findFilter = carModel.find.mock.calls[0][0];
      expect(findFilter._id.$in).toEqual(
        expect.arrayContaining(['car-id-1', 'car-id-2']),
      );
    });

    it('should build a $match stage with brand regex when brand is provided', async () => {
      setupAggregation([], []);

      await service.findCarsBySpecifications({ brand: 'BMW' } as any);

      const pipeline = carSpecsModel.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.brand).toEqual({ $regex: 'BMW', $options: 'i' });
    });

    it('should build a $match stage with model regex when model is provided', async () => {
      setupAggregation([], []);

      await service.findCarsBySpecifications({ model: '3 Series' } as any);

      const pipeline = carSpecsModel.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.model).toEqual({
        $regex: '3 Series',
        $options: 'i',
      });
    });

    it('should apply price range filter to the match stage', async () => {
      setupAggregation([], []);

      await service.findCarsBySpecifications({
        priceRange: { min: 10000, max: 50000 },
      } as any);

      const pipeline = carSpecsModel.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.price).toEqual({ $gte: 10000, $lte: 50000 });
    });

    it('should apply year range filter to the match stage', async () => {
      setupAggregation([], []);

      await service.findCarsBySpecifications({
        yearRange: { min: 2018, max: 2023 },
      } as any);

      const pipeline = carSpecsModel.aggregate.mock.calls[0][0];
      expect(pipeline[0].$match.year).toEqual({ $gte: 2018, $lte: 2023 });
    });

    it('should build no $match stage when no filters are provided', async () => {
      setupAggregation([], []);

      await service.findCarsBySpecifications({} as any);

      const pipeline = carSpecsModel.aggregate.mock.calls[0][0];
      expect(pipeline).toHaveLength(0);
    });

    it('should return empty result when aggregation returns no specs', async () => {
      setupAggregation([], []);

      const result = await service.findCarsBySpecifications({} as any);

      expect(result).toEqual({ total: 0, cars: [] });
    });

    it('should limit aggregation results to 100', async () => {
      const mockLimit = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });
      carSpecsModel.aggregate.mockReturnValue({ limit: mockLimit });
      carModel.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      await service.findCarsBySpecifications({} as any);

      expect(mockLimit).toHaveBeenCalledWith(100);
    });
  });

  // ─── removeOldCarSpecs ─────────────────────────────────────────────────────

  describe('removeOldCarSpecs', () => {
    it('should delete specs older than the given number of days', async () => {
      carSpecsModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 8 }),
      });

      await service.removeOldCarSpecs(60);

      const filter = carSpecsModel.deleteMany.mock.calls[0][0];
      expect(filter.createdAt.$lte).toBeInstanceOf(Date);
      const expected = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      expect(
        Math.abs(filter.createdAt.$lte.getTime() - expected.getTime()),
      ).toBeLessThan(2000);
    });
  });
});
