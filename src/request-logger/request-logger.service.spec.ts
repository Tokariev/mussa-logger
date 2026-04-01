import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RequestLoggerService } from './request-logger.service';
import { RequestLog } from '../schemas/request-log.schema';

function chainable(resolvedValue?: any) {
  const q: any = {
    sort: jest.fn(),
    lean: jest.fn(),
    exec: jest.fn().mockResolvedValue(resolvedValue),
  };
  q.sort.mockReturnValue(q);
  q.lean.mockReturnValue(q);
  q.then = (resolve: any, reject: any) =>
    Promise.resolve(resolvedValue).then(resolve, reject);
  return q;
}

describe('RequestLoggerService', () => {
  let service: RequestLoggerService;
  let logModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestLoggerService,
        {
          provide: getModelToken(RequestLog.name),
          useValue: {
            find: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestLoggerService>(RequestLoggerService);
    logModel = module.get(getModelToken(RequestLog.name));
  });

  // ─── search ────────────────────────────────────────────────────────────────

  describe('search', () => {
    it('should search by url only when only url is provided', async () => {
      logModel.find.mockReturnValue(chainable([]));

      await service.search({ url: 'http://test.com' } as any);

      expect(logModel.find).toHaveBeenCalledWith(
        { url: 'http://test.com' },
        { _id: 0, __v: 0 },
      );
    });

    it('should search by route only when only route is provided', async () => {
      logModel.find.mockReturnValue(chainable([]));

      await service.search({ route: '/parser' } as any);

      expect(logModel.find).toHaveBeenCalledWith(
        { route: '/parser' },
        { _id: 0, __v: 0 },
      );
    });

    it('should search by both url and route when both are provided', async () => {
      logModel.find.mockReturnValue(chainable([]));

      await service.search({ url: 'http://test.com', route: '/parser' } as any);

      expect(logModel.find).toHaveBeenCalledWith(
        { url: 'http://test.com', route: '/parser' },
        { _id: 0, __v: 0 },
      );
    });

    it('should use an empty filter when neither url nor route is provided', async () => {
      logModel.find.mockReturnValue(chainable([]));

      await service.search({} as any);

      expect(logModel.find).toHaveBeenCalledWith({}, { _id: 0, __v: 0 });
    });

    it('should sort results by createdAt descending', async () => {
      const q = chainable([]);
      logModel.find.mockReturnValue(q);

      await service.search({ url: 'http://test.com' } as any);

      expect(q.sort).toHaveBeenCalledWith({ createdAt: -1 });
    });
  });

  // ─── removeOldRequestLogs ──────────────────────────────────────────────────

  describe('removeOldRequestLogs', () => {
    it('should delete log records older than the given number of days', async () => {
      logModel.deleteMany.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 3 }),
      });

      await service.removeOldRequestLogs(10);

      const filter = logModel.deleteMany.mock.calls[0][0];
      expect(filter.createdAt.$lte).toBeInstanceOf(Date);
      const expected = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      expect(
        Math.abs(filter.createdAt.$lte.getTime() - expected.getTime()),
      ).toBeLessThan(2000);
    });
  });
});
