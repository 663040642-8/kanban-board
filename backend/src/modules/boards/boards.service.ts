import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { supabase } from 'src/supabase/supabase.client';
import { InviteMemberDto } from './dto/invite-member.dto';
import { createSupabaseClient } from 'src/supabase/supabase.service';

@Injectable()
export class BoardsService {
    async createBoard(dto: CreateBoardDto, userId: string, accessToken: string) {
        const supabase = createSupabaseClient(accessToken);

        const { data, error } = await supabase
            .from('boards')
            .insert([{ name: dto.name, owner_id: userId }])
            .select()
            .single();

        if (error) throw new Error(error.message);

        await supabase
            .from('board_members')
            .insert([{ board_id: data.id, user_id: userId, role: 'owner' }]);

        return data;
    }

    async getBoardById(boardId: string, userId: string, accessToken: string) {
        const supabaseClient = createSupabaseClient(accessToken);

        // ตรวจสอบว่าผู้ใช้เป็นสมาชิกของ board นี้
        const { data: member } = await supabaseClient
            .from('board_members')
            .select('id')
            .eq('board_id', boardId)
            .eq('user_id', userId)
            .single();

        if (!member) {
            throw new ForbiddenException('You are not a member of this board');
        }

        // ดึงข้อมูล board
        const { data, error } = await supabaseClient
            .from('boards')
            .select('id, name, owner_id, created_at')
            .eq('id', boardId)
            .single();

        if (error) throw new Error(error.message);

        return data;
    }


    async getMyBoards(userId: string, accessToken: string) {
        const supabaseClient = createSupabaseClient(accessToken);
        const { data, error } = await supabaseClient
            .from('board_members')
            .select(`
                board:boards (
                    id,
                    name,
                    owner_id,
                    created_at
                )
            `)
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        return data.map((item: any) => item.board);
    }

    async inviteMember(dto: InviteMemberDto) {
        // 1. check owner
        const { data: ownerCheck } = await supabase
            .from('board_members')
            .select('id')
            .eq('board_id', dto.boardId)
            .eq('user_id', dto.inviterId)
            .eq('role', 'owner')
            .single();

        if (!ownerCheck) {
            throw new ForbiddenException('Only owner can invite');
        }

        // 2. find user by email
        const email = dto.email.trim().toLowerCase();
        const { data: user } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (!user) {
            throw new Error('User not found');
        }

        // 3. check duplicate
        const { data: existingMember } = await supabase
            .from('board_members')
            .select('id')
            .eq('board_id', dto.boardId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existingMember) {
            throw new Error('User already a member of this board');
        }

        // 4. insert member
        const { data, error } = await supabase
            .from('board_members')
            .insert({
                board_id: dto.boardId,
                user_id: user.id,
                role: dto.role,
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    async getBoardMembers(boardId: string) {
        const { data, error } = await supabase
            .from('board_members')
            .select(`
                user:profiles(id, email),
                role
            `)
            .eq('board_id', boardId);

        if (error) throw new Error(error.message);
        return data;
    }

    async updateBoard(boardId: string, name: string) {
        const { data, error } = await supabase
            .from('boards')
            .update({ name })
            .eq('id', boardId)
            .select()
            .maybeSingle();

        if (error) throw new Error(error.message);
        if (!data) throw new Error('Board not found or no permission');

        return data;
    }

    async deleteBoard(boardId: string) {
        const { error } = await supabase
            .from('boards')
            .delete()
            .eq('id', boardId);

        if (error) throw new Error(error.message);
        return { success: true };
    }

}