import {Injectable} from '@angular/core';
import {ApiProvider} from "../api/api";
import {Observable} from "rxjs";
import {LoginData, LoginResponse, UserData} from "../types/app-types";

@Injectable()
export class AuthProvider {

  constructor(public api: ApiProvider) {
  }

  login(loginData: LoginData): Observable<LoginResponse> {
    return this.api.post('login', this.fillBody(loginData))
  }

  getServices() {
    return this.api.get('services-info')
  }

  getAreas() {
    return this.api.get('', null, this.api.domainUrl + '/geo/children/102358')

  }

  getCities(stateId) {
    return this.api.get('', null, this.api.domainUrl + '/geo/children/' + stateId)
  }

  updateProfile(userData: UserData | any, token) {
    return this.api.post('update-profile', this.fillBody(userData), {api_token: token})
  }

  updateLocation(location: { lat: number, long: number }, token: string) {
    return this.api.post('change-location', this.fillBody(location), {api_token: token})
  }

  refreshToken(token) {
    return this.api.get('auth/refresh', {api_token: token});
  }

  logout(token: string): Observable<{ success: boolean }> {
    return this.api.post('logout', null, {api_token: token})
  }

  checkPhoneNumber(phone) {
    return this.api.post('password', {phone}, null, null)
  }

  verifyCode(phone, code) {
    return this.api.post('password/verify', {phone, code})
  }

  updatePassword(token, password, confirm_password) {
    return this.api.post('update-forget-password', this.fillBody({password, confirm_password}), {api_token: token})
  }

  createAccount(data) {
    return this.api.post('register', this.fillBody(data))
  }

  private fillBody(data: object): FormData {
    let body = new FormData();
    Object.keys(data).forEach(key => body.append(key, data[key]));
    return body;
  }
}
