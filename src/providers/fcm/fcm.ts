import { FCM } from '@ionic-native/fcm';
import { Injectable } from '@angular/core';
import { AppstorageProvider } from '../appstorage/appstorage';

@Injectable()
export class FcmProvider {

  constructor(public fcm: FCM, private storageProvider: AppstorageProvider) {
    console.log('Hello FcmProvider Provider');
  }


  async getToken() {
    const fcmToken = await this.fcm.getToken();

    return this.storageProvider.saveFcmToken(fcmToken);
  }
}
