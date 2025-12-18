import { Component, inject, OnInit, signal } from '@angular/core';
import { BoardsService } from '../../services/boards-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface Board {
  id: string;
  name: string;
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  boardService = inject(BoardsService);

  boards = signal<Board[]>([]);
  showModal = signal(false);
  newBoardName = '';

  async ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.boardService.getMyBoards().subscribe({
      next: data => {
        this.boards.set(data);
      },
      error: error => {
        console.error('Error loading buy requests:', error);
      }
    });
  }

  createBoard() {
    const name = this.newBoardName.trim();
    if (!name) return;

    this.boardService.createBoard({ name }).subscribe({
      next: newBoard => {
        // เพิ่ม board ใหม่เข้า signal
        this.boards.update(b => [...b, newBoard]);
        // รีเซ็ต input และปิด modal
        this.newBoardName = '';
        this.showModal.set(false);
      },
      error: err => console.error('Error creating board:', err)
    });
  }
}
