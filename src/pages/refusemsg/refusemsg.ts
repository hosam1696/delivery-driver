import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';



@IonicPage()
@Component({
  selector: 'page-refusemsg',
  templateUrl: 'refusemsg.html',
})
export class RefusemsgPage {
  msg: string;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public utils: UtilsProvider) {
  }

  dismiss(msg: string | null, btnType:'ok'|'cancel') {
    if (btnType == 'cancel') {
      this.viewCtrl.dismiss({msg, action: this.navParams.data.action});
    } else {
      if (msg && msg.trim()) 
        this.viewCtrl.dismiss({msg, action: this.navParams.data.action});
      else
        this.utils.showToast('يجب ادخال سبب الرفض')
    }
  }

}
