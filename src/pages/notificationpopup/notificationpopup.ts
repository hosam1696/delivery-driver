import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-notificationpopup',
  templateUrl: 'notificationpopup.html',
})
export class NotificationpopupPage {
  data = this.navParams.get('orderData');

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationpopupPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
