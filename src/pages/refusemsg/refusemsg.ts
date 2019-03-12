import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-refusemsg',
  templateUrl: 'refusemsg.html',
})
export class RefusemsgPage {
  msg: string;
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RefusemsgPage');
  }

  dismiss() {
    this.viewCtrl.dismiss({msg: this.msg});
  }

}
