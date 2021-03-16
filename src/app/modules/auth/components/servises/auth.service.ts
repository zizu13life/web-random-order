import { UserService } from 'src/app/modules/user/service/user.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/modules/user/models/user';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  currentUser: User;
  exp: number;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  loginWithGoogle(authData: gapi.auth2.AuthResponse) {
    return this.http.post(environment.baseApiUrl + 'auth/google/login', authData);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.currentUser == null || this.exp < new Date().getTime()) {
      return this.userService.getAccountWithAuthDetails().pipe(
        map(data => {
          this.currentUser = data.user;
          this.exp = data.exp;
          return true;
        }),
        catchError((err, caught) => {
          this.router.navigate(['login']);
          return of(false);
        }));
    }
    return true;
  }

}
