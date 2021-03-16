import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

const BASE_URL = environment.baseApiUrl + 'user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {

  }

  getAccount() {
    return this.http.get<User>(BASE_URL + '/me');
  }

  getAccountWithAuthDetails() {
    return this.http.get<{ user: User, exp: number }>(BASE_URL + '/account');
  }

  getAll(){
    return this.http.get<User[]>(BASE_URL);
  }

}
