import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Board } from '../pages/dashboard/dashboard';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private baseUrl = 'http://localhost:3000';
  http = inject(HttpClient)

  getMyBoards() {
    return this.http.get<any[]>(`${this.baseUrl}/boards`);
  }

  createBoard(boardData: { name: string; }) {
    return this.http.post<any>(`${this.baseUrl}/boards`, boardData);
  }

  inviteMember(boardId: string, memberEmail: { email: string; }) {
    return this.http.post<any>(`${this.baseUrl}/boards/${boardId}/members`, memberEmail);
  }

  getBoardMembers(boardId: string) {
    return this.http.get<{
      user: {
        id: string;
        email: string;
      };
      role: string;
    }[]>(`${this.baseUrl}/boards/${boardId}/members`);
  }

  getBoard(boardId: string) {
    return this.http.get<{
      id: string;
      name: string;
      owner_id: string;
      created_at: string;
    }>(`${this.baseUrl}/boards/${boardId}`);
  }

  updateBoard(boardId: string, name: string) {
    return this.http.patch<Board>(
      `${this.baseUrl}/boards/${boardId}`,
      { name }
    );
  }

  deleteBoard(boardId: string) {
    return this.http.delete(
      `${this.baseUrl}/boards/${boardId}`
    );
  }
}
