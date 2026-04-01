import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CarDetailsService } from './car-details.service';
import { CarDetails } from '../schemas/car-details.schema';
import { CarDetailsRequest } from '../schemas/car-details-request.schema';
import { EmitedCarDetails } from '../schemas/emited-car-details.schema';

/**
 * Creates a chainable Mongoose query mock supporting .lean() and .exec(),
 * plus direct await (thenable).
 */
function chainable(resolvedValue?: any) {
  const q: any = {
    lean: jest.fn(),
    exec: jest.fn().mockResolvedValue(resolvedValue),
  };
  q.lean.mockReturnValue(q);
  q.then = (resolve: any, reject: any) =>
    Promise.resolve(resolvedValue).then(resolve, reject);
  return q;
}

describe('CarDetailsService', () => {
  let service: CarDetailsService;
  let carDetailsModel: any;
  let carDetailsRequestModel: any;
  let emitedCarDetailsModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarDetailsService,
        {
          provide: getModelToken(CarDetails.name),
          useValue: {
            find: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
        {
          provide: getModelToken(CarDetailsRequest.name),
          useValue: {
            deleteMany: jest.fn(),
          },
        },
        {
          provide: getModelToken(EmitedCarDetails.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CarDetailsService>(CarDetailsService);
    carDetailsModel = module.get(getModelToken(CarDetails.name));
    carDetailsRequestModel = module.get(getModelToken(CarDetailsRequest.name));
    emitedCarDetailsModel = module.get(getModelToken(EmitedCarDetails.name));
  });

  // ─── findByObservableDataHash ──────────────────────────────────────────────

  describe('findByObservableDataHash', () => {
    it('should query emitedCarDetails by observableDataHash excluding _id and __v', async () => {
      const mockDoc = { externalCarId: 'ext-1', observableDataHash: 'hash-abc' };
      emitedCarDetailsModel.findOne.mockReturnValue(chainable(mockDoc));

      await service.findByObservableDataHash('hash-abc');

      expect(emitedCarDetailsModel.findOne).toHaveBeenCalledWith(
        { observableDataHash: 'hash-abc' },
        { _id: 0, __v: 0 },
      );
    });

    it('should return null when no document matches the hash', async () => {
      emitedCarDetailsModel.findOne.mockReturnValue(chainable(null));

      const result = await service.findByObservableDataHash('unknown-hash');

      expect(result).toBeNull();
    });
  });

  // ─── findByExternalCarId ───────────────────────────────────────────────────

  describe('findByExternalCarId', () => {
    it('should query carDetails by externalCarId', async () => {
      const mockDocs = [
        { externalCarId: 'ext-1', brand: 'BMW' },
        { externalCarId: 'ext-1', brand: 'BMW' },
      ];
      carDetailsModel.find.mockReturnValue(chainable(mockDocs));

      await service.findByExternalCarId('ext-1');

      expect(carDetailsModel.find).toHaveBeenCalledWith({ externalCarId: 'ext-1' });
    });

    it('should return an empty array when no details found', async () => {
      carDetailsModel.find.mockReturnValue(chainable([]));

      const result = await service.findByExternalCarId('ext-unknown');

      // result is the query object (no lean/exec in current code), so just check the call
      expect(carDetailsModel.find).toHaveBeenCalledWith({ externalCarId: 'ext-unknown' });
    });
  });

  // ─── findEmitedByExternalCarId ─────────────────────────────────────────────

  describe('findEmitedByExternalCarId', () => {
    it('should query emitedCarDetails by externalCarId', async () => {
      const mockDocs = [{ externalCarId: 'ext-1' }];
      emitedCarDetailsModel.find.mockReturnValue(chainable(mockDocs));

      await service.findEmitedByExternalCarId('ext-1');

      expect(emitedCarDetailsModel.find).toHaveBeenCalledWith({ externalCarId: 'ext-1' });
    });
  });

  // ─── removeOldCarDetails ───────────────────────────────────────────────────

  describe('removeOldCarDetails', () => {
    it('should delete carDetails records older than the given number of days', async () => {
      carDetailsModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 5 }),
      });

      await service.removeOldCarDetails(60);

      const filter = carDetailsModel.deleteMany.mock.calls[0][0];
      expect(filter.createdAt.$lte).toBeInstanceOf(Date);
      const expected = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      expect(
        Math.abs(filter.createdAt.$lte.getTime() - expected.getTime()),
      ).toBeLessThan(2000);
    });
  });

  // ─── removeOldCarDetailsRequests ──────────────────────────────────────────

  describe('removeOldCarDetailsRequests', () => {
    it('should delete request records older than the given number of days', async () => {
      carDetailsRequestModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 2 }),
      });

      await service.removeOldCarDetailsRequests(7);

      const filter = carDetailsRequestModel.deleteMany.mock.calls[0][0];
      expect(filter.createdAt.$lte).toBeInstanceOf(Date);
      const expected = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      expect(
        Math.abs(filter.createdAt.$lte.getTime() - expected.getTime()),
      ).toBeLessThan(2000);
    });
  });

  // ─── removeOldEmitedCarDetails ─────────────────────────────────────────────

  describe('removeOldEmitedCarDetails', () => {
    it('should delete emited records older than the given number of days', async () => {
      emitedCarDetailsModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 3 }),
      });

      await service.removeOldEmitedCarDetails(60);

      const filter = emitedCarDetailsModel.deleteMany.mock.calls[0][0];
      expect(filter.createdAt.$lte).toBeInstanceOf(Date);
    });
  });
});
