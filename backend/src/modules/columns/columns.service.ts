import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { supabase } from 'src/supabase/supabase.client';

@Injectable()
export class ColumnsService {
    async createColumn(boardId: string, dto: CreateColumnDto) {
        // หา position ล่าสุด
        const { data: lastColumn, error: posError } = await supabase
            .from('columns')
            .select('position')
            .eq('board_id', boardId)
            .order('position', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (posError) throw new Error(posError.message);

        const nextPosition = lastColumn ? lastColumn.position + 1 : 1;

        // insert
        const { data, error } = await supabase
            .from('columns')
            .insert({
                board_id: boardId,
                name: dto.name,
                position: nextPosition,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async getColumnsByBoard(boardId: string) {
        const { data, error } = await supabase
            .from('columns')
            .select('*')
            .eq('board_id', boardId)
            .order('position', { ascending: true });

        if (error) throw new Error(error.message);
        return data;
    }

    async updateColumn(columnId: string, dto: { name: string }) {
        const { data, error } = await supabase
            .from('columns')
            .update({ name: dto.name })
            .eq('id', columnId)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async deleteColumn(columnId: string) {
        const { error } = await supabase
            .from('columns')
            .delete()
            .eq('id', columnId);

        if (error) throw new Error(error.message);

        return { success: true };
    }
}
