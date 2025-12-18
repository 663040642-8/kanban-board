import { Test, TestingModule } from '@nestjs/testing';
import { AssignTaskService } from './assign-task.service';

describe('AssignTaskService', () => {
  let service: AssignTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignTaskService],
    }).compile();

    service = module.get<AssignTaskService>(AssignTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
