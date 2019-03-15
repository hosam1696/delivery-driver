import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";

@Injectable()
export class AuthProvider {

  constructor(public api: ApiProvider) {
  }

  login(loginData) {
    return this.api.post('login', loginData)
  }

  updateProfile(userData, token) {
    let body = new FormData();
    Object.keys(userData).forEach(key => body.append(key, userData[key]));
    return this.api.post('update-profile', body, {api_token: token})
  }
}
