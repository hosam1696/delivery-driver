import { Injectable } from '@angular/core';
import { AppstorageProvider } from '../appstorage/appstorage';
import { Platform, ModalController, Events } from 'ionic-angular';
import { EVENTS } from '../types/app-types';
import { Firebase } from '@ionic-native/firebase';
import { Observable } from 'rxjs/Observable';
import { FCM } from '@ionic-native/fcm';

@Injectable()
export class FcmProvider {

  constructor(public firebase: Firebase,
              public fcm: FCM,
              public platform: Platform,
              private storageProvider: AppstorageProvider,
              public events: Events,
              private modalCtrl: ModalController) {

    this.events.subscribe(EVENTS.NOTIFICATION_POPUP, (data?: any) => this.openNotificationPopup(data));

  }


  onNotificationOpen() {
    return new Observable(observer => {
          (window as any).FirebasePlugin.onMessageReceived((response) => {
              observer.next(response);
          });
      });
  }

  private openNotificationPopup(data?:any) {
    const modal = this.modalCtrl.create('NotificationpopupPage', {orderData: data});

    modal.present();
  }

  async getToken() {

    const fcmToken = await this.firebase.getToken();
    return this.storageProvider.saveFcmToken(fcmToken);
  }
}
