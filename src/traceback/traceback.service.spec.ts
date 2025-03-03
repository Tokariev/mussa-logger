import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TracebackService } from './traceback.service';
import { TracebackError } from '../schemas/traceback-error.schema';

describe('TracebackService', () => {
  let service: TracebackService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracebackService,
        {
          provide: getModelToken(TracebackError.name),
          useValue: {
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TracebackService>(TracebackService);
    model = module.get(getModelToken(TracebackError.name));
  });

  it('should return the count of failed parse requests for today', async () => {
    const count = 5;
    model.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(count),
    });

    const result = await service.getCountOfFailedParseRequests();
    expect(result).toBe(count);
    expect(model.countDocuments).toHaveBeenCalledWith({
      service: 'mobile_svc_parser',
      createdAt: {
        $gte: expect.any(Date),
        $lt: expect.any(Date),
      },
    });
  });
});
