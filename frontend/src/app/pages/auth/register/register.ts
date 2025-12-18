import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  loading = signal(false);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    name: ['', Validators.required],
  });


  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading.set(true);

    const { email, password, name } = this.registerForm.value;

    try {
      await this.auth.signUp(email!, password!, name!);
      this.router.navigate(['/verify']);
    } catch (err) {
      console.error('Regiater failed:', err);
      alert('Regiater failed. Please check your data');
    } finally {
      this.loading.set(false);
    }
  }
}