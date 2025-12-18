import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@UseGuards(SupabaseAuthGuard)
@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post('columns/:columnId/tasks')
    createTask(
        @Param('columnId') columnId: string,
        @Body() dto: CreateTaskDto,
    ) {
        return this.tasksService.createTask(columnId, dto);
    }

    @Get('columns/:columnId/tasks')
    getTasks(@Param('columnId') columnId: string) {
        return this.tasksService.getTasksByColumn(columnId);
    }

    @Patch('tasks/:taskId')
    updateTask(
        @Param('taskId') taskId: string,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.tasksService.updateTask(taskId, dto);
    }

    @Delete('tasks/:taskId')
    deleteTask(@Param('taskId') taskId: string) {
        return this.tasksService.deleteTask(taskId);
    }
}
