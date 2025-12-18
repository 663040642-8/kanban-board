import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Column, ColumnsService } from '../../services/columns-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TasksService } from '../../services/task-service';
import { BoardsService } from '../../services/boards-service';
import { AssignTaskService } from '../../services/assign-task.service';

type EntityType = 'board' | 'column' | 'task';

interface ActionState {
  type: EntityType | null;
  id: string | null;
  name: string;
  description?: string;
  action: 'rename' | 'delete' | 'invite' | 'create' | 'unassign' | 'assign' | 'view' | null;
}

@Component({
  selector: 'app-board-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
})
export class BoardDetail implements OnInit {

  private router = inject(Router);
  private columnsService = inject(ColumnsService);
  private tasksService = inject(TasksService);
  private boardsService = inject(BoardsService);
  private assignService = inject(AssignTaskService);
  private route = inject(ActivatedRoute);

  boardId = '';
  boardName = signal<string>('');
  columns = signal<Column[]>([]);
  members = signal<{ user: { id: string; email: string }, role: string }[]>([]);
  assignees = signal<{ id: string; email: string }[]>([]);
  selectedAssignees = signal<Set<string>>(new Set());
  selectedTaskId: string | null = null;

  inviteEmail = '';
  newColumnName = '';
  newTaskTitle = '';
  newTaskDescription = '';
  selectedColumnId = '';

  // Unified modal state
  actionState = signal<ActionState>({
    type: null,
    id: null,
    name: '',
    description: '',
    action: null
  });

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id')!;
    this.loadBoard();
    this.loadColumns();
    this.loadMembers();
  }

  /** Load Board, Columns, Tasks, Members */
  loadBoard() {
    this.boardsService.getBoard(this.boardId).subscribe({
      next: b => this.boardName.set(b.name),
      error: err => console.error(err)
    });
  }

  loadColumns() {
    this.columnsService.getColumns(this.boardId).subscribe({
      next: cols => {
        this.columns.set(cols);
        cols.forEach(c => this.loadTasks(c.id));
      },
      error: err => console.error(err)
    });
  }
  closeModal() {
    this.actionState.set({ type: null, id: null, name: '', description: '', action: null });
  }

  /** Members who can be assigned to the selected task */
  get availableMembers() {
    if (!this.actionState().id) return [];
    const task = this.columns().flatMap(c => c.tasks || []).find(t => t.id === this.actionState().id);
    if (!task) return [];
    // filter member ที่ยังไม่ได้ assign
    return this.members().filter(m => !(task.assignees || []).some(a => a.id === m.user.id));
  }


  loadTasks(columnId: string) {
    this.tasksService.getTasks(columnId).subscribe({
      next: tasks => {
        this.columns.update(cols => cols.map(c =>
          c.id === columnId ? { ...c, tasks } : c
        ));
      },
      error: err => console.error(err)
    });
  }



  loadMembers() {
    this.boardsService.getBoardMembers(this.boardId).subscribe({
      next: data => this.members.set(data),
      error: err => console.error(err)
    });
  }

/** Task ที่กำลัง view */
get viewingTask() {
  if (!this.actionState().id) return null;
  for (const col of this.columns()) {
    const task = (col.tasks || []).find(t => t.id === this.actionState().id);
    if (task) return task;
  }
  return null;
}


  /** Column */
  createColumn() {
    const name = this.newColumnName.trim();
    if (!name) return;
    this.columnsService.createColumn(this.boardId, { name }).subscribe({
      next: col => {
        this.columns.update(cols => [...cols, { ...col, tasks: [] }]);
        this.newColumnName = '';
        this.actionState.set({ type: null, id: null, name: '', description: '', action: null });
      },
      error: err => console.error(err)
    });
  }

  /** Task */
  openTaskModal(columnId: string) {
    this.selectedColumnId = columnId;
    this.actionState.set({ type: 'task', id: null, name: '', description: '', action: 'create' });
  }

  openCreateColumnModal() {
    this.actionState.set({ type: 'column', id: null, name: '', action: 'create' });
  }

  createTask() {
    if (!this.selectedColumnId || !this.newTaskTitle.trim()) return;
    const payload = { title: this.newTaskTitle.trim(), description: this.newTaskDescription.trim() };
    this.tasksService.createTask(this.selectedColumnId, payload).subscribe({
      next: task => {
        this.columns.update(cols =>
          cols.map(c =>
            c.id === this.selectedColumnId ? { ...c, tasks: [...(c.tasks || []), task] } : c
          )
        );
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.actionState.set({ type: null, id: null, name: '', description: '', action: null });
      },
      error: err => console.error(err)
    });
  }

  /** Invite */
  inviteMember() {
    const email = this.inviteEmail.trim();
    if (!email) return;
    this.boardsService.inviteMember(this.boardId, { email }).subscribe({
      next: () => {
        this.inviteEmail = '';
        this.loadMembers();
      },
      error: err => console.error(err)
    });
  }

  /** Assign / Unassign */
  openAssignModal(taskId: string | null) {
    if (!taskId) return;
    const task = this.columns().flatMap(c => c.tasks || []).find(t => t.id === taskId);
    if (!task) return;

    // เพิ่มบรรทัดเหล่านี้
    this.selectedTaskId = task.id; // เซ็ต taskId ให้ confirmAssign ใช้งาน
    this.selectedAssignees.set(new Set((task.assignees || []).map(a => a.id))); // preload assignees

    this.actionState.set({
      type: 'task',
      id: task.id,
      name: task.title,
      description: task.description,
      action: 'assign'
    });
  }

  get selectedTask() {
    if (!this.selectedTaskId) return null;
    for (const col of this.columns()) {
      const task = (col.tasks || []).find(t => t.id === this.selectedTaskId);
      if (task) return task;
    }
    return null;
  }

  get assignedUsers() {
    return this.selectedTask?.assignees || [];
  }

  get hasAssignedUsers() {
    return this.assignedUsers.length > 0;
  }



  toggleSelect(userId: string) {
    const s = new Set(this.selectedAssignees());
    s.has(userId) ? s.delete(userId) : s.add(userId);
    this.selectedAssignees.set(s);
  }

  confirmAssign() {
    if (!this.selectedTaskId) return;
    const ids = Array.from(this.selectedAssignees());

    this.assignService.assignMany(this.selectedTaskId, ids).subscribe({
      next: () => {
        this.loadColumns(); // อัพเดต columns + tasks
        this.selectedAssignees.set(new Set()); // reset selection
        this.selectedTaskId = null; // reset taskId
        this.closeModal(); // ปิด modal
      },
      error: err => console.error(err)
    });
  }

  openUnassignModal(taskId: string) {
    this.selectedTaskId = taskId;
    this.assignService.getAssignees(taskId).subscribe(data => {
      this.assignees.set(data.map(d => d.user));
    });
    this.actionState.set({ type: 'task', id: taskId, name: '', action: 'unassign' });
  }

  unassign(userId: string) {
    if (!this.selectedTaskId) return;
    this.assignService.unassign(this.selectedTaskId, userId).subscribe({
      next: () => {
        // 1. อัพเดต assignees ของ modal
        this.assignees.update(list => list.filter(u => u.id !== userId));

        // 2. อัพเดต columns -> tasks -> assignees
        this.columns.update(cols =>
          cols.map(c => ({
            ...c,
            tasks: (c.tasks || []).map(t =>
              t.id === this.selectedTaskId
                ? { ...t, assignees: (t.assignees || []).filter(a => a.id !== userId) }
                : t
            )
          }))
        );
      },
      error: err => console.error(err)
    });
  }


  /** Unified Modal Methods */
  openRenameModal = (type: EntityType, id: string, name: string, description?: string) => {
    this.actionState.set({ type, id, name, description: description || '', action: 'rename' });
  }

  openDeleteModal = (type: EntityType, id: string, name: string) => {
    this.actionState.set({ type, id, name, action: 'delete' });
  }

  confirmAction() {
    const { type, id, name, description, action } = this.actionState();
    if (!type || !id || !action) return;

    switch (action) {
      case 'rename':
        if (type === 'board') this.renameBoard(id, name);
        if (type === 'column') this.renameColumn(id, name);
        if (type === 'task') this.renameTask(id, name, description);
        break;
      case 'delete':
        if (type === 'board') this.deleteBoard(id);
        if (type === 'column') this.deleteColumn(id);
        if (type === 'task') this.deleteTask(id);
        break;
    }
    this.actionState.set({ type: null, id: null, name: '', description: '', action: null });
  }

  /** Board */
  renameBoard(id: string, name: string) {
    this.boardsService.updateBoard(id, name).subscribe(board => this.boardName.set(board.name));
  }
  deleteBoard(id: string) {
    this.boardsService.deleteBoard(id).subscribe(() => this.router.navigate(['/home']));
  }

  /** Column */
  renameColumn(id: string, name: string) {
    this.columnsService.updateColumn(id, name).subscribe(updated => {
      this.columns.update(cols => cols.map(c => c.id === id ? { ...c, name: updated.name } : c));
    });
  }
  deleteColumn(id: string) {
    this.columnsService.deleteColumn(id).subscribe(() => {
      this.columns.update(cols => cols.filter(c => c.id !== id));
    });
  }

  /** Task */
  renameTask(id: string, title: string, description?: string) {
    this.tasksService.updateTask(id, { title, description }).subscribe(updated => {
      this.columns.update(cols => cols.map(c => ({
        ...c,
        tasks: (c.tasks || []).map(t => t.id === id ? { ...t, title: updated.title, description: updated.description } : t)
      })));
    });
  }
  deleteTask(id: string) {
    this.tasksService.deleteTask(id).subscribe(() => {
      this.columns.update(cols => cols.map(c => ({
        ...c,
        tasks: (c.tasks || []).filter(t => t.id !== id)
      })));
    });
  }

}
