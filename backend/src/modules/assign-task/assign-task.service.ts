import { Injectable } from '@nestjs/common';
import { supabase } from 'src/supabase/supabase.client';

@Injectable()
export class AssignTaskService {
    async assignMany(taskId: string, userIds: string[]) {
        if (!userIds || userIds.length === 0) return [];

        // 1. หา assignee ที่มีอยู่แล้ว
        const { data: existing } = await supabase
            .from('task_assignees')
            .select('user_id')
            .eq('task_id', taskId)
            .in('user_id', userIds);

        const existingIds = new Set(
            (existing || []).map(e => e.user_id),
        );

        // 2. filter เฉพาะที่ยังไม่มี
        const toInsert = userIds
            .filter(id => !existingIds.has(id))
            .map(id => ({
                task_id: taskId,
                user_id: id,
            }));

        if (toInsert.length === 0) return [];

        // 3. insert ทีเดียว
        const { data, error } = await supabase
            .from('task_assignees')
            .insert(toInsert)
            .select(`
            user:profiles (
                id,
                email
            )
        `);

        if (error) throw error;

        return data;
    }


    async assign(taskId: string, userId: string) {
        // 1. check duplicate
        const { data: exists } = await supabase
            .from('task_assignees')
            .select('id')
            .eq('task_id', taskId)
            .eq('user_id', userId)
            .maybeSingle();

        if (exists) {
            throw new Error('User already assigned to this task');
        }

        // 2. insert
        const { data, error } = await supabase
            .from('task_assignees')
            .insert({
                task_id: taskId,
                user_id: userId,
            })
            .select(`
                user:profiles (
                    id,
                    email
                )
            `)
            .single();

        if (error) throw error;

        return data;
    }


    async unassign(taskId: string, userId: string) {
        const { error } = await supabase
            .from('task_assignees')
            .delete()
            .eq('task_id', taskId)
            .eq('user_id', userId);

        if (error) throw error;

        return { success: true };
    }

    async getAssignees(taskId: string) {
        const { data, error } = await supabase
            .from('task_assignees')
            .select(`
            user:profiles (
                id,
                email
            )
            `)
            .eq('task_id', taskId);

        if (error) throw error;

        return data;
    }

}
