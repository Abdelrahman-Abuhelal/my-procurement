import { HttpInterceptorFn } from '@angular/common/http';
import { readStoredSession } from './auth.storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = readStoredSession();

  if (!session?.token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${session.token}`,
      },
    }),
  );
};
