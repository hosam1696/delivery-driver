import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";

@Injectable()
export class AuthProvider {

  constructor(public api: ApiProvider) {
  }

  login(loginData) {
    
    let body = new FormData();
    Object.keys(loginData).forEach(key => body.append(key, loginData[key]));
    return this.api.post('login', body)
  }

  updateProfile(userData, token) {
    let body = new FormData();
    Object.keys(userData).forEach(key => body.append(key, userData[key]));
    return this.api.post('update-profile', body, {api_token: token})
  }
}
