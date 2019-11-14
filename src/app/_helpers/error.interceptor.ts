import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { AuthenticationService } from "@app/_services/authentication.service";
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        //TODO HANDLE MORE ERRORS (E.G. 500 IF NEEDED)
        if (error.status === 0) {
          this.toastr.warning('Brak połączenia z serwerem backendowym.');
        }

        if (error.status === 401 || error.status === 403) {
          this.authenticationService.clearUserFromStorage();
          if (error.status === 403) {
            location.reload(true);
          }
        }
        if (error.status === 400) {
          this.toastr.error(error.error.message, "Błąd");
        } 
          const errorText = error.error.message || error.statusText;
        return throwError(errorText);
        
      })
    );
  }
}
