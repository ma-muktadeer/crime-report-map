import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CommonService } from './softcafe/service/common.service';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  // Write your logic
  console.log('Inside interceptor');

  const router = inject(Router);
  const token = 'Bearer ' + sessionStorage.getItem('AUTH_TOKEN');
  const cs = inject(CommonService);

  let xhr = req;

  if (req.url.includes('/public/') || req.url.includes('/assets/env/')) {
    xhr = req.clone({
      withCredentials: true, //local false and live true
      setHeaders: {
        // 'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    // return next(xhr);
  } else {
    if (!req.headers.get('Authorization')) {
      // const token = sessionStorage!.getItem("AUTH_TOKEN");
      xhr = req.clone({
        withCredentials: true,
        setHeaders: {
          // 'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: token ? token : 'Bearer ' + sessionStorage.getItem('AUTH_TOKEN'), //local false and live true
        },
      });
      // return next(xhr);
    } else {
      const header = req.headers;

      xhr = req.clone({
        withCredentials: true,
        headers: header,
      });
    }
  }

  return next(xhr).pipe(
    catchError((error: any) => {
      if (error.status === 403) {
        cs.removeSession();
        router.navigate(['/login'], { queryParams: { sessionExpired: true } });
      }
      return throwError(() => error);
    })
  );
};
