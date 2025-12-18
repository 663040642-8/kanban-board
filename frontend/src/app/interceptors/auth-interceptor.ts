import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { supabase } from '../supabase/supabaseClient';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  return from(supabase.auth.getSession()).pipe(
    switchMap(({ data }) => {
      const accessToken = data.session?.access_token;
      const cloned = accessToken
        ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
        : req;
      return next(cloned);
    })
  );
};
