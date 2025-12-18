import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { InviteMemberDto, UserRole } from './dto/invite-member.dto';

@UseGuards(SupabaseAuthGuard)
@Controller('boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) { }

    @Post()
    createBoard(@Body() dto: CreateBoardDto, @Req() req: any) {
        return this.boardsService.createBoard(dto, req.user.id, req.accessToken);
    }

    @Get()
    getMyBoards(@Req() req: any) {
        return this.boardsService.getMyBoards(req.user.id, req.accessToken);
    }

    @Get(':id')
    getBoard(
        @Param('id') boardId: string,
        @Req() req: any,
    ) {
        return this.boardsService.getBoardById(
            boardId,
            req.user.id,
            req.accessToken,
        );
    }

    @Post(':boardId/members')
    async inviteMember(
        @Req() req: any,
        @Param('boardId') boardId: string,
        @Body() body: { email: string }
    ) {
        const dto: InviteMemberDto = {
            boardId,
            email: body.email,
            inviterId: req.user.id,
            role: UserRole.member,
        };
        return this.boardsService.inviteMember(dto);
    }

    @Get(':boardId/members')
    getBoardMembers(@Param('boardId') boardId: string) {
        return this.boardsService.getBoardMembers(boardId);
    }

    @Patch(':boardId')
    updateBoard(
        @Param('boardId') boardId: string,
        @Body() body: { name: string },
    ) {
        return this.boardsService.updateBoard(boardId, body.name);
    }

    @Delete(':boardId')
    deleteBoard(@Param('boardId') boardId: string) {
        return this.boardsService.deleteBoard(boardId);
    }

}

