import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import {appLangs, UserData} from "../types/app-types";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class AppstorageProvider {
  _appLang: string | appLangs = 'ar';
  private _user = new BehaviorSubject(null);
  emittedUser = this._user.asObservable();

  constructor(public storage: Storage) {
  }

  async getAppLang() {
    let appLang = await this.storage.get('delivery:app:lang');
    return this._appLang = appLang ? appLang : this.setAppLang('ar'); // default app language is arabic
  }

  async setAppLang(lang: appLangs | string) {
    return this._appLang = await this.storage.set('delivery:app:lang', lang);
  }


  getUserData(): Promise<UserData> {
    return this.storage.get('delivery:user:data');
  }

  setUserData(user: UserData):Promise<UserData> {
    this._user.next(user);
    return this.storage.set('delivery:user:data', user);
  }

  getSavedToken() {
    return this.storage.get('delivery:api:token')
  }

  saveToken(token) {
    return this.storage.set('delivery:api:token', token)
  }

  getFcmToken() {
    return this.storage.get('delivery:fcm:token')
  }

  saveFcmToken(token) {
    return this.storage.set('delivery:fcm:token', token)
  }
  
}
