import { FCM } from '@ionic-native/fcm';
import { Injectable } from '@angular/core';
import { AppstorageProvider } from '../appstorage/appstorage';
import { Platform } from 'ionic-angular';

@Injectable()
export class FcmProvider {

  constructor(public fcm: FCM, public platform: Platform, private storageProvider: AppstorageProvider) {
    console.log('Hello FcmProvider Provider');
  }


  async getToken() {
    if (!this.platform.is('cordova')) {
      return 'TEST TOKEN FROM BROWSER';  
    }
    const fcmToken = await this.fcm.getToken();
    
    return this.storageProvider.saveFcmToken(fcmToken);
  }
}
