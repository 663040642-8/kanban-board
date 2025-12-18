import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase , supabaseAdmin } from '../supabase/supabase.client';
import { SignUpDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  async signUp(dto: SignUpDto) {
    const { email, password, name } = dto;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      },
    });

    if (error) throw new UnauthorizedException(error.message);

    const user = data.user;
    if (!user) throw new UnauthorizedException('No user returned');

    return { user, session: data.session };
  }

  async login(dto: LoginDto) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.session) throw new UnauthorizedException(error?.message || 'Login failed');

    return {
      access_token: data.session.access_token,
      user: data.user,
    };
  }
}
