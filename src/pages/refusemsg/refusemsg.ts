import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-refusemsg',
  templateUrl: 'refusemsg.html',
})
export class RefusemsgPage {
  msg: string;
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
  }

  dismiss(msg) {
    this.viewCtrl.dismiss({msg, action: this.navParams.data.action});
  }

}
