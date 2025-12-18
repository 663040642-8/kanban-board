import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { CreateColumnDto } from './dto/create-column.dto';
import { ColumnsService } from './columns.service';

@UseGuards(SupabaseAuthGuard)
@Controller()
export class ColumnsController {
    constructor(private readonly columnsService: ColumnsService) { }

    // Create column
    @Post('boards/:boardId/columns')
    createColumn(
        @Param('boardId') boardId: string,
        @Body() dto: CreateColumnDto,
    ) {
        return this.columnsService.createColumn(boardId, dto);
    }

    // Get columns by board
    @Get('boards/:boardId/columns')
    getColumns(@Param('boardId') boardId: string) {
        return this.columnsService.getColumnsByBoard(boardId);
    }

    // Update column (rename)
    @Patch('columns/:columnId')
    updateColumn(
        @Param('columnId') columnId: string,
        @Body() dto: { name: string },
    ) {
        return this.columnsService.updateColumn(columnId, dto);
    }

    // Delete column
    @Delete('columns/:columnId')
    deleteColumn(@Param('columnId') columnId: string) {
        return this.columnsService.deleteColumn(columnId);
    }
}
