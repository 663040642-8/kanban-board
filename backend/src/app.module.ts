import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsModule } from './modules/boards/boards.module';
import { ColumnsModule } from './modules/columns/columns.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AssignTaskModule } from './modules/assign-task/assign-task.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, }), BoardsModule, ColumnsModule, TasksModule, AssignTaskModule, NotificationsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
