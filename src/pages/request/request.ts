import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import {OrdersProvider} from "../../providers/orders/orders";
import {DriverOrder, Order, RequestAction, UserData} from "../../providers/types/app-types";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {UtilsProvider} from "../../providers/utils/utils";



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
              private modalCtrl: ModalController,
              private appStorage: AppstorageProvider,
              private orderProvider: OrdersProvider,
              private utils: UtilsProvider,
              private events: Events
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
    switch (requetAction) {
      case 'accept':
        this.acceptRequest();
        break;
      case 'await':
        this.showModal();
        break;
      case 'cancel':
        this.cancelRequest();
        break;
    }
  }

  showModal() {
    const modal = this.modalCtrl.create('DelayorderPage');

    modal.onDidDismiss(accept => {
      if (accept) {
        this.awaitRequest();
      }
    })

    modal.present();
  }

  private acceptRequest() {
    this.orderProvider.acceptOrder(this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status
          this.events.publish('updateOrders');

        }
        this.utils.showToast(response.message)
      })
  }

  private awaitRequest() {
    this.orderProvider.awaitOrder(this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status
          this.events.publish('updateOrders');
        }
        this.utils.showToast(response.message)
      })
  }


  private cancelRequest() {
    this.orderProvider.cancelOrder(this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status;
          this.events.publish('updateOrders');

        }
        this.utils.showToast(response.message)

      })
  }

  goToUserPage() {
    this.navCtrl.push('UserPage', {user: this.driverOrder.order.user, orderId: this.driverOrder.id});
  }
}
