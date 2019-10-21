import { FCM } from '@ionic-native/fcm';
import { Injectable } from '@angular/core';
import { AppstorageProvider } from '../appstorage/appstorage';
import { Platform, ModalController, Events } from 'ionic-angular';
import { EVENTS } from '../types/app-types';

@Injectable()
export class FcmProvider {

  constructor(public fcm: FCM, public platform: Platform,
              private storageProvider: AppstorageProvider,
              public events: Events,
              private modalCtrl: ModalController) {

    this.events.subscribe(EVENTS.NOTIFICATION_POPUP, (data?: any) => this.openNotificationPopup(data));

  }


  handleNotifications() {
    if (this.platform.is('cordova') || this.platform.is('android') ) {
      this.fcm.onNotification().subscribe(data => {

        if(data.wasTapped){
          console.log("Received in background");
          if (data.order_id) {
            this.openNotificationPopup(data);
            this.events.publish(EVENTS.UPDATE_ORDERS);
          }
        } else {
          console.log("Received in foreground");
          if (data.order_id) {
            this.openNotificationPopup(data);
            this.events.publish(EVENTS.UPDATE_ORDERS);
          }
        }
      });
    }
  }

  private openNotificationPopup(data?:any) {
    const modal = this.modalCtrl.create('NotificationpopupPage', {orderData: data});

    modal.present();
  }

  async getToken() {

    const fcmToken = await this.fcm.getToken();
    
    return this.storageProvider.saveFcmToken(fcmToken);
  }
}
