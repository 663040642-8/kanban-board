import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AssignTaskService } from './assign-task.service';

@Controller('tasks')
export class AssignTaskController {
    constructor(
        private readonly service: AssignTaskService,
    ) { }

    @Post(':taskId/assignees')
    assignMany(
        @Param('taskId') taskId: string,
        @Body() body: { user_ids: string[] },
    ) {
        return this.service.assignMany(taskId, body.user_ids);
    }

    @Post(':taskId/assignees')
    assign(
        @Param('taskId') taskId: string,
        @Body() body: { user_id: string },
    ) {
        return this.service.assign(taskId, body.user_id);
    }

    @Delete(':taskId/assignees/:userId')
    unassign(
        @Param('taskId') taskId: string,
        @Param('userId') userId: string,
    ) {
        return this.service.unassign(taskId, userId);
    }

    @Get(':taskId/assignees')
    getAssignees(
        @Param('taskId') taskId: string,
    ) {
        return this.service.getAssignees(taskId);
    }
}
