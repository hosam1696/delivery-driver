import { FCM } from '@ionic-native/fcm';
import { Injectable } from '@angular/core';
import { AppstorageProvider } from '../appstorage/appstorage';
import { Platform, ModalController, Events } from 'ionic-angular';

@Injectable()
export class FcmProvider {

  constructor(public fcm: FCM, public platform: Platform,
              private storageProvider: AppstorageProvider,
              public events: Events,
              private modalCtrl: ModalController) {

    // this.handleNotifications();

    this.events.subscribe('open:popup', (data?:any) => this.openNotificationPopup(data))
  }


  handleNotifications() {
    // if (this.platform.is('cordova') ) {
      this.fcm.onNotification().subscribe(data => {

        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
        this.events.publish('open:popup', data);
        this.events.publish('updateOrders');
      });
    // }
    
  }

  private openNotificationPopup(data?:any) {
    const modal = this.modalCtrl.create('NotificationpopupPage', {orderData: data});

    modal.present();
  }

  async getToken() {
    if (!this.platform.is('cordova')) {
      return 'TEST TOKEN FROM BROWSER';  
    }
    const fcmToken = await this.fcm.getToken();
    
    return this.storageProvider.saveFcmToken(fcmToken);
  }
}
