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
    return this.api.post('update-profile', userData, {api_token: token})
  }
}
