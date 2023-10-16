import {Injectable, NgModule} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(
    private http: HttpClient
  ) {
  }

  onLogin(payload: any): Observable<any> {
    return this.http
      .post<any>(`https://localhost:7169/api/Account/login`, payload)
      .pipe(catchError(error => throwError(error)));
  }

  onRegister(payload: any): Observable<any> {
    return this.http
      .post<any>(`https://localhost:7169/api/Account/unau/register`, payload)
      .pipe(catchError(error => throwError(error)));
  }
}
