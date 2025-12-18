import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task-service';

export interface Column {
  id: string;
  name: string;
  tasks?: Task[];
}


export interface CreateColumnDto {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000'; // เปลี่ยนเป็น URL backend จริง

  // สร้าง column ใหม่
  createColumn(boardId: string, dto: CreateColumnDto): Observable<Column> {
    return this.http.post<Column>(`${this.baseUrl}/boards/${boardId}/columns`, dto);
  }

  // ดึง columns ของ board
  getColumns(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.baseUrl}/boards/${boardId}/columns`);
  }

  // เปลี่ยนชื่อ column
  updateColumn(columnId: string, name: string): Observable<Column> {
    return this.http.patch<Column>(`${this.baseUrl}/columns/${columnId}`, { name });
  }

  // ลบ column
  deleteColumn(columnId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/columns/${columnId}`);
  }
}
