import { Module } from '@nestjs/common';
import { AssignTaskController } from './assign-task.controller';
import { AssignTaskService } from './assign-task.service';

@Module({
  controllers: [AssignTaskController],
  providers: [AssignTaskService]
})
export class AssignTaskModule {}
