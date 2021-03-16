import { Router } from '@angular/router';
import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from '../servises/auth.service';
import { take, finalize } from 'rxjs/operators';
import { UserService } from 'src/app/modules/user/service/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  public auth2: gapi.auth2.GoogleAuth;

  constructor(private auth: AuthService, private userSercice: UserService,
    private router: Router, private ngZone: NgZone) {
    window['onSignIn'] = this.afterLogin;
  }

  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '275153414427-q2j7e5elrcn421vig7jdchek8qmpkpc8.apps.googleusercontent.com',
        cookie_policy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, googleUser => {
      this.ngZone.run(() => {
        this.loading = true;
        //      const profile = googleUser.getBasicProfile();
        const respose = googleUser.getAuthResponse();
        this.afterLogin(respose);
      });
    }, (error) => {
      this.loading = false;
      alert(JSON.stringify(error, undefined, 2));
    });
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  afterLogin = (respose: gapi.auth2.AuthResponse) => {

    this.auth.loginWithGoogle(respose)
      .pipe(finalize(() => this.loading = false))
      .subscribe(ok => {
        this.router.navigate(['order']);
      });

  }

  ngOnInit() {

  }

}
