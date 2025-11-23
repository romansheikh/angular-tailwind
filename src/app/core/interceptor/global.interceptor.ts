import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ApiResponseModel, Status } from '../models/apiresponse';
import { tap } from 'rxjs';

let firstRequest = true;

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  // SMART SKIP RULES
  const skip =
    firstRequest ||
    req.method === 'GET' ||
    req.url.includes('refresh') ||
    req.url.includes('check') ||
    req.url.includes('settings') ||
    req.url.includes('pair-rate');

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {

          const body = event.body as ApiResponseModel | null;

          // Skip swal based on rule
          if (skip) {
            firstRequest = false;
            return;
          }

          if (!body || typeof body.Status === 'undefined') return;

          // SUCCESS
          if (body.Status === Status.Success) {
            Swal.fire({
              icon: 'success',
              text: body.Message,
              timer: 1500,
            });
          }
          // ERROR
          else {
            Swal.fire({
              icon: 'error',
              text: body.Message,
            });
          }
        }
      },

      error: (error) => {
        if (skip) {
          firstRequest = false;
          return;
        }

        Swal.fire({
          icon: 'error',
          text: error?.error?.Message || 'Something went wrong!',
        });
      }
    })
  );
};
