import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OrdersProvider} from "../../providers/orders/orders";
import {DriverOrder, Order, RequestAction, UserData} from "../../providers/types/app-types";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";



@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
  request: Order;
  driverOrder: DriverOrder;
  userData: UserData;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appStorage: AppstorageProvider,
              private orderProvider: OrdersProvider
              ) {
  }

  async ionViewDidLoad() {
    console.log(this.navParams.get('request'));
    this.driverOrder = this.navParams.get('request');
    this.userData = await  this.appStorage.getUserData();

    this.getRequestDetails();
  }

  getRequestDetails() {
    const request$ = this.orderProvider.getOrderDetails(this.driverOrder.id, this.userData.api_token);


    request$.subscribe(response => {
      console.log(response);
      if (response.success) {
        this.driverOrder = response.data.order;
      }

    })
  }


  onClick(requetAction : keyof RequestAction) {

  }

  goToUserPage() {
    this.navCtrl.push('UserPage', {user: this.driverOrder.order.user});
  }
}
