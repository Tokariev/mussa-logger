import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CarService } from './car.service';
import { Car } from '../schemas/car.schema';
import { CarDetails } from '../schemas/car-details.schema';
import { CarDetailsRequest } from '../schemas/car-details-request.schema';
import { CarToJazmakki } from '../schemas/car-to-jazmakki.schema';
import { RequestLog } from '../schemas/request-log.schema';

/**
 * Creates a chainable Mongoose query mock that supports:
 * .sort(), .lean(), .select(), .limit(), .countDocuments(), .exec()
 * and is also directly awaitable (like a real Mongoose query).
 */
function chainable(resolvedValue?: any) {
  const q: any = {
    sort: jest.fn(),
    lean: jest.fn(),
    exec: jest.fn().mockResolvedValue(resolvedValue),
    select: jest.fn(),
    limit: jest.fn(),
    countDocuments: jest.fn(),
  };
  q.sort.mockReturnValue(q);
  q.lean.mockReturnValue(q);
  q.select.mockReturnValue(q);
  q.limit.mockReturnValue(q);
  q.countDocuments.mockReturnValue(q);
  // Make directly awaitable (Mongoose queries are thenables)
  q.then = (resolve: any, reject: any) =>
    Promise.resolve(resolvedValue).then(resolve, reject);
  return q;
}

describe('CarService', () => {
  let service: CarService;
  let carModel: any;
  let carDetailsModel: any;
  let carDetailsRequestModel: any;
  let carToJazmakkiModel: any;
  let requestLogModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getModelToken(Car.name),
          useValue: {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            updateMany: jest.fn(),
            deleteMany: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken(CarDetails.name),
          useValue: { find: jest.fn() },
        },
        {
          provide: getModelToken(CarDetailsRequest.name),
          useValue: { find: jest.fn() },
        },
        {
          provide: getModelToken(CarToJazmakki.name),
          useValue: { find: jest.fn() },
        },
        {
          provide: getModelToken(RequestLog.name),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    carModel = module.get(getModelToken(Car.name));
    carDetailsModel = module.get(getModelToken(CarDetails.name));
    carDetailsRequestModel = module.get(getModelToken(CarDetailsRequest.name));
    carToJazmakkiModel = module.get(getModelToken(CarToJazmakki.name));
    requestLogModel = module.get(getModelToken(RequestLog.name));
  });

  // ─── updatePrice ───────────────────────────────────────────────────────────

  describe('updatePrice', () => {
    it('should call findByIdAndUpdate with $set price and $push to price_history', async () => {
      const updatedCar = { price: 2000, price_history: [{ price: 2000 }] };
      const q = chainable(updatedCar);
      carModel.findByIdAndUpdate.mockReturnValue(q);

      const result = await service.updatePrice({ documentId: 'doc-1', newPrice: 2000 });

      expect(carModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'doc-1',
        {
          $set: { price: 2000 },
          $push: { price_history: { price: 2000, timestamp: expect.any(Date) } },
        },
        { new: true },
      );
      expect(result).toEqual(updatedCar);
    });
  });

  // ─── updatePriceById ───────────────────────────────────────────────────────

  describe('updatePriceById', () => {
    it('should call model.create once with the provided car data', async () => {
      const carData = { externalCarId: 'ext-1', price: 5000 } as any;
      carModel.create.mockResolvedValue({});

      await service.updatePriceById(carData);

      expect(carModel.create).toHaveBeenCalledWith(carData);
      expect(carModel.create).toHaveBeenCalledTimes(1);
    });
  });

  // ─── findAllByUrl ──────────────────────────────────────────────────────────

  describe('findAllByUrl', () => {
    it('should query cars filtered by source and sorted by createdAt desc', async () => {
      const mockCars = [{ externalCarId: 'ext-1' }, { externalCarId: 'ext-2' }];
      const q = chainable(mockCars);
      carModel.find.mockReturnValue(q);

      await service.findAllByUrl({ source: 'mobile.de' } as any);

      expect(carModel.find).toHaveBeenCalledWith({ source: 'mobile.de' });
      expect(q.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  // ─── findLastByUrl ─────────────────────────────────────────────────────────

  describe('findLastByUrl', () => {
    it('should find one car by source sorted by createdAt desc', async () => {
      const mockCar = { externalCarId: 'ext-1' };
      const q = chainable(mockCar);
      carModel.findOne.mockReturnValue(q);

      await service.findLastByUrl({ source: 'mobile.de' } as any);

      expect(carModel.findOne).toHaveBeenCalledWith({ source: 'mobile.de' });
      expect(q.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  // ─── findAllCarsWithoutCarDetails ──────────────────────────────────────────

  describe('findAllCarsWithoutCarDetails', () => {
    it('should return empty array when no cars found for yesterday', async () => {
      carToJazmakkiModel.find.mockReturnValue(chainable([]));

      const result = await service.findAllCarsWithoutCarDetails();

      expect(result).toEqual([]);
      expect(carDetailsModel.find).not.toHaveBeenCalled();
    });

    it('should return only cars that have no matching car details', async () => {
      const cars = [
        { externalCarId: 'ext-1' },
        { externalCarId: 'ext-2' },
        { externalCarId: 'ext-3' },
      ];
      carToJazmakkiModel.find.mockReturnValue(chainable(cars));
      carDetailsModel.find.mockReturnValue(
        chainable([{ externalCarId: 'ext-2' }]),
      );

      const result = await service.findAllCarsWithoutCarDetails();

      expect(result).toHaveLength(2);
      const ids = result.map((c: any) => c.externalCarId);
      expect(ids).toContain('ext-1');
      expect(ids).toContain('ext-3');
      expect(ids).not.toContain('ext-2');
    });

    it('should limit the result to 20 cars', async () => {
      const cars = Array.from({ length: 25 }, (_, i) => ({
        externalCarId: `ext-${i}`,
      }));
      carToJazmakkiModel.find.mockReturnValue(chainable(cars));
      carDetailsModel.find.mockReturnValue(chainable([]));

      const result = await service.findAllCarsWithoutCarDetails();

      expect(result).toHaveLength(20);
    });

    it('should query carToJazmakki with a yesterday date range', async () => {
      carToJazmakkiModel.find.mockReturnValue(chainable([]));

      await service.findAllCarsWithoutCarDetails();

      const filter = carToJazmakkiModel.find.mock.calls[0][0];
      expect(filter.createdAt.$gte).toBeInstanceOf(Date);
      expect(filter.createdAt.$lt).toBeInstanceOf(Date);
      expect(filter.createdAt.$lt.getTime()).toBeGreaterThan(
        filter.createdAt.$gte.getTime(),
      );
    });

    it('should query carDetails using $in with the found externalCarIds', async () => {
      const cars = [{ externalCarId: 'ext-1' }, { externalCarId: 'ext-2' }];
      carToJazmakkiModel.find.mockReturnValue(chainable(cars));
      carDetailsModel.find.mockReturnValue(chainable([]));

      await service.findAllCarsWithoutCarDetails();

      expect(carDetailsModel.find).toHaveBeenCalledWith({
        externalCarId: { $in: ['ext-1', 'ext-2'] },
      });
    });
  });

  // ─── countCarsWithoutCarDetails ────────────────────────────────────────────

  describe('countCarsWithoutCarDetails', () => {
    it('should return the count of cars without details', async () => {
      const cars = [{ externalCarId: 'ext-1' }, { externalCarId: 'ext-2' }];
      carToJazmakkiModel.find.mockReturnValue(chainable(cars));
      carDetailsModel.find.mockReturnValue(chainable([]));

      const count = await service.countCarsWithoutCarDetails();

      expect(count).toBe(2);
    });

    it('should return 0 when all cars have details', async () => {
      const cars = [{ externalCarId: 'ext-1' }];
      carToJazmakkiModel.find.mockReturnValue(chainable(cars));
      carDetailsModel.find.mockReturnValue(
        chainable([{ externalCarId: 'ext-1' }]),
      );

      const count = await service.countCarsWithoutCarDetails();

      expect(count).toBe(0);
    });
  });

  // ─── deleteCar ─────────────────────────────────────────────────────────────

  describe('deleteCar', () => {
    it('should call deleteMany with the given externalCarId', () => {
      const mockExec = jest.fn().mockResolvedValue({ deletedCount: 1 });
      carModel.deleteMany.mockReturnValue({ exec: mockExec });

      service.deleteCar('ext-1');

      expect(carModel.deleteMany).toHaveBeenCalledWith({ externalCarId: 'ext-1' });
      expect(mockExec).toHaveBeenCalledTimes(1);
    });
  });

  // ─── updateCarStatus ───────────────────────────────────────────────────────

  describe('updateCarStatus', () => {
    it('should call updateMany with the given externalCarId and status', () => {
      const mockExec = jest.fn().mockResolvedValue({ modifiedCount: 1 });
      carModel.updateMany.mockReturnValue({ exec: mockExec });

      service.updateCarStatus('ext-1', 'inactive');

      expect(carModel.updateMany).toHaveBeenCalledWith(
        { externalCarId: 'ext-1' },
        { ad_status: 'inactive' },
      );
      expect(mockExec).toHaveBeenCalledTimes(1);
    });
  });

  // ─── removeOldCars ─────────────────────────────────────────────────────────

  describe('removeOldCars', () => {
    it('should delete cars with createdAt older than given days', async () => {
      carModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 10 }),
      });

      await service.removeOldCars(60);

      const filter = carModel.deleteMany.mock.calls[0][0];
      expect(filter.createdAt.$lte).toBeInstanceOf(Date);
      const expected = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      expect(
        Math.abs(filter.createdAt.$lte.getTime() - expected.getTime()),
      ).toBeLessThan(2000);
    });
  });
});
