import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/node';

const enableSentry = (err: { message: string }) => {
  Sentry.captureException(err);
  return throwError(() => new Error(err?.message));
};
@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(
    _: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(catchError(enableSentry));
  }
}
