import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {appLangs, UserData, LOCAL_STORAGE} from "../types/app-types";

@Injectable()
export class AppstorageProvider {
  _appLang: string | appLangs = 'ar';

  constructor(public storage: Storage) {
  }

  async getAppLang() {
    let appLang = await this.storage.get(LOCAL_STORAGE.LANG);
    return this._appLang = appLang ? appLang : this.setAppLang('ar'); // default app language is arabic
  }

  async setAppLang(lang: appLangs | string) {
    return this._appLang = await this.storage.set(LOCAL_STORAGE.LANG, lang);
  }

  getUserData(): Promise<UserData> {
    return this.storage.get(LOCAL_STORAGE.USERDATA);
  }

  setUserData(user: UserData): Promise<UserData> {
    return this.storage.set(LOCAL_STORAGE.USERDATA, user);
  }

  getSavedToken() {
    return this.storage.get(LOCAL_STORAGE.API_TOKEN)
  }

  saveToken(token) {
    return this.storage.set(LOCAL_STORAGE.API_TOKEN, token)
  }

  // getFcmToken() {
  //   return this.storage.get('delivery:fcm:token')
  // }

  saveFcmToken(token) {
    return this.storage.set(LOCAL_STORAGE.FCM_TOKEN, token)
  }

}
