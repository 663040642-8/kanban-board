import { Injectable } from '@nestjs/common';
import { supabase } from 'src/supabase/supabase.client';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    async createTask(columnId: string, dto: CreateTaskDto) {
        // หา position ล่าสุด
        const { data: lastTask } = await supabase
            .from('tasks')
            .select('position')
            .eq('column_id', columnId)
            .order('position', { ascending: false })
            .limit(1)
            .maybeSingle();

        const position = lastTask ? lastTask.position + 1 : 1;

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                column_id: columnId,
                title: dto.title,
                description: dto.description,
                position,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async getTasksByColumn(columnId: string) {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
            id,
            title,
            description,
            position,
            task_assignees (
                user:profiles (
                id,
                email
                )
            )
            `)
            .eq('column_id', columnId)
            .order('position');

        if (error) throw error;

        // map ให้อยู่รูปที่ frontend ใช้ได้ทันที
        return data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            position: task.position,
            assignees: task.task_assignees
                ?.map(a => a.user)
                .filter(Boolean) || []
        }));
    }

    async updateTask(taskId: string, dto: UpdateTaskDto) {
        const { data, error } = await supabase
            .from('tasks')
            .update(dto)
            .eq('id', taskId)
            .select()
            .maybeSingle();

        if (error) throw new Error(error.message);

        if (!data) {
            throw new Error('Task not found or no permission');
        }

        return data;
    }

    async deleteTask(taskId: string) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) throw new Error(error.message);
        return { success: true };
    }
}
