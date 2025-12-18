import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { BoardDetail } from './pages/board-detail/board-detail';
import { Verify } from './pages/auth/verify/verify';

export const routes: Routes = [
    { path: 'home', component: Dashboard },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'verify', component: Verify },
    { path: 'boards/:id', component: BoardDetail },
    { path: '**', redirectTo: 'home' }
];
