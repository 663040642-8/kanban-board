import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    try {
      const user = await this.auth.signIn(email!, password!);
      this.router.navigate(['/home']);
    } catch (err) {
      alert('Incorrect email or password.');
    }
  }
}
