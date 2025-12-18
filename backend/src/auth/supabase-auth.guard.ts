import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization; 
    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw new UnauthorizedException();

    req.user = { id: data.user.id };
    req.accessToken = token;
    
    return true;
  }
}
