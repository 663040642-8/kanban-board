import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignees: {
    id: string;
    email: string;
  }[];
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000'; // เปลี่ยนเป็น URL backend จริง

  // สร้าง Task ใหม่
  createTask(columnId: string, dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/columns/${columnId}/tasks`, dto);
  }

  // ดึง Task ของ column
  getTasks(columnId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/columns/${columnId}/tasks`);
  }

  // อัปเดต Task
  updateTask(taskId: string, dto: UpdateTaskDto): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${taskId}`, dto);
  }

  // ลบ Task
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${taskId}`);
  }
}
