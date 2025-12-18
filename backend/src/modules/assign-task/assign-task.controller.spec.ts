import { Test, TestingModule } from '@nestjs/testing';
import { AssignTaskController } from './assign-task.controller';

describe('AssignTaskController', () => {
  let controller: AssignTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignTaskController],
    }).compile();

    controller = module.get<AssignTaskController>(AssignTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
