import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ordersstates',
  templateUrl: 'ordersstates.html',
})
export class OrdersstatesPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}
