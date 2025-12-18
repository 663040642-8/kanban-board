import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AssignTaskService {
  private baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  assign(taskId: string, userId: string) {
    return this.http.post(
      `${this.baseUrl}/tasks/${taskId}/assignees`,
      { user_id: userId }
    );
  }

  assignMany(taskId: string, userIds: string[]) {
    return this.http.post(
      `${this.baseUrl}/tasks/${taskId}/assignees`,
      { user_ids: userIds }
    );
  }

  unassign(taskId: string, userId: string) {
    return this.http.delete(
      `${this.baseUrl}/tasks/${taskId}/assignees/${userId}`
    );
  }

  getAssignees(taskId: string) {
    return this.http.get<
      { user: { id: string; email: string } }[]
    >(`${this.baseUrl}/tasks/${taskId}/assignees`);
  }
}
