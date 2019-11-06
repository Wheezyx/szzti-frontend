import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { AuthenticationService } from "@app/services/authentication.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          this.authenticationService.logout();
          if (error.status === 403) {
            location.reload(true);
          }
        }

        const errorText = error.error.message || error.statusText;
        return throwError(errorText);
      })
    );
  }
}
