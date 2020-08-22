import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { UserData } from '../../providers/types/app-types';



@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  userData: UserData
  notifications;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private appStorageProvider: AppstorageProvider,
     private api: NotificationsProvider
     ) {
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();
    this.getNotifications()
  }

  private getNotifications() {

    this.api.getNotifications(this.userData.api_token)
      .subscribe(response => {
        console.log({response})
        if (response.success) {
          this.notifications = response.data.notifications;
        }
      })
  }

}
