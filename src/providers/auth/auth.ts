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

  getProfile(token) {
    return this.api.get('get-profile',  {api_token: token})
  }

  updateProfile(userData, token) {
    let body = new FormData();
    Object.keys(userData).forEach(key => body.append(key, userData[key]));
    return this.api.post('update-profile', body, {api_token: token})
  }

  updateLocation(location: {lat: number, long: number}, token: string) {
    let body = new FormData();
    Object.keys(location).forEach(key => body.append(key, location[key]));
    return this.api.post('change-location', location, {api_token: token})
  }
}
