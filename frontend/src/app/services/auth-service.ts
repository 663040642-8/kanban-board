import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { SupabaseService } from '../supabase/supabase-service';
import { User } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loading = signal<boolean>(true);
  #user = signal<User | null>(null);
  private supabase = inject(SupabaseService);

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { data, error };
  }

  get user() {
    return this.#user;
  }

  get userId(): string | null {
    return this.#user()?.id || null;
  }

  get isLoggedIn() {
    return !!this.#user();
  }

  async signOut() {
    await this.supabase.auth.signOut();
    this.#user.set(null);
  }
}
