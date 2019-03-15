import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-delayorder',
  templateUrl: 'delayorder.html',
})
export class DelayorderPage {

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DelayorderPage');
  }

  dismiss(accept?:boolean ) {
    this.viewCtrl.dismiss(accept);
  }

}
