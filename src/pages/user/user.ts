import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {User, UserData} from "../../providers/types/app-types";
import { OrdersProvider } from '../../providers/orders/orders';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';


@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  requestUser: User = this.navParams.get('user');
  orderId = this.navParams.get('orderId');
  userData: UserData; 

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private ordersProvider: OrdersProvider,
    private appStorageProvider: AppstorageProvider,
    public navParams: NavParams) {
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();
  }

  goToMaps() {
    this.navCtrl.push('MapPage', {user: this.requestUser})
  }


  showModal() {
    const modal = this.modalCtrl.create('RefusemsgPage');

    modal.onDidDismiss(data => {
      if (data.msg && data.msg.trim()) {
        this.refuseOffer(data.msg);
      }
    })

    modal.present();
  }

  refuseOffer(msg) {
    this.ordersProvider.refuseOrder(this.orderId, this.userData.api_token, msg)

      .subscribe(response =>{ 
        console.log(response);
      })
  }

  onDeliver() {

  }


}
