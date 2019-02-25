import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";

@Injectable()
export class AuthProvider {

  constructor(public api: ApiProvider) {
    console.log('Hello AuthProvider Provider');
  }

  login(loginData) {
    return this.api.post('login', loginData)
  }
}
