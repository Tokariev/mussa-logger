import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CountService } from './count.service';
import { Car } from '../schemas/car.schema';
import { Error } from '../schemas/error.schema';

describe('CountService', () => {
  let service: CountService;
  let carModel: any;
  let errorModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountService,
        {
          provide: getModelToken(Car.name),
          useValue: {
            countDocuments: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getModelToken(Error.name),
          useValue: {
            countDocuments: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountService>(CountService);
    carModel = module.get(getModelToken(Car.name));
    errorModel = module.get(getModelToken(Error.name));
  });

  // ─── readCountOfCars ───────────────────────────────────────────────────────

  describe('readCountOfCars', () => {
    it('should count all car documents', async () => {
      carModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(42),
      });

      const result = await service.readCountOfCars();

      expect(result).toBe(42);
      expect(carModel.countDocuments).toHaveBeenCalledTimes(1);
    });
  });

  // ─── readCountOfCarsToday ──────────────────────────────────────────────────

  describe('readCountOfCarsToday', () => {
    it('should return the count of cars created today', async () => {
      carModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(10),
      });

      const result = await service.readCountOfCarsToday();

      expect(result).toBe(10);
    });

    it('should filter by createdAt >= start of today (midnight)', async () => {
      carModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.readCountOfCarsToday();

      const filter = carModel.countDocuments.mock.calls[0][0];
      expect(filter.createdAt.$gte).toBeInstanceOf(Date);
      expect(filter.createdAt.$gte.getHours()).toBe(0);
      expect(filter.createdAt.$gte.getMinutes()).toBe(0);
      expect(filter.createdAt.$gte.getSeconds()).toBe(0);
    });
  });

  // ─── readCountOfErrors ─────────────────────────────────────────────────────

  describe('readCountOfErrors', () => {
    it('should count all error documents', async () => {
      errorModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(7),
      });

      const result = await service.readCountOfErrors();

      expect(result).toBe(7);
      expect(errorModel.countDocuments).toHaveBeenCalledTimes(1);
    });
  });

  // ─── readCountOfErrorsToday ────────────────────────────────────────────────

  describe('readCountOfErrorsToday', () => {
    it('should return the count of errors created today', async () => {
      errorModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(3),
      });

      const result = await service.readCountOfErrorsToday();

      expect(result).toBe(3);
    });

    it('should filter by createdAt >= start of today (midnight)', async () => {
      errorModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      });

      await service.readCountOfErrorsToday();

      const filter = errorModel.countDocuments.mock.calls[0][0];
      expect(filter.createdAt.$gte).toBeInstanceOf(Date);
      expect(filter.createdAt.$gte.getHours()).toBe(0);
      expect(filter.createdAt.$gte.getMinutes()).toBe(0);
      expect(filter.createdAt.$gte.getSeconds()).toBe(0);
    });
  });
});
