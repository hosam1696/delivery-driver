import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DriverOrder, UserData} from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { OrdersProvider } from '../../providers/orders/orders';
import { UtilsProvider } from '../../providers/utils/utils';


@IonicPage()
@Component({
  selector: 'page-waitingorders',
  templateUrl: 'waitingorders.html',
})
export class WaitingordersPage {
  isReceivingRequests:boolean;
  userData: UserData;
  allRequests: DriverOrder[];

  
  constructor(public navCtrl: NavController,
               public navParams: NavParams,
               private appStorageProvider: AppstorageProvider,
               private ordersProvider: OrdersProvider,
               private utils: UtilsProvider,
               ) {
  }

  
  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.getWaitingOrders()
  }


  private getWaitingOrders() {

    const orders$ = this.ordersProvider.getWaitingOrders(this.userData.api_token);

    orders$.subscribe(response => {
      console.log({waitingOrders: response});
      if (response.success) {
        this.allRequests = response.data.orders;
      }
    })
  }

  onToggleChange(event) {
    this.isReceivingRequests = event.value;
    this.changeOrderStatus();
  }


  changeOrderStatus() {
    const deliveryStatus$ = this.ordersProvider.changeDeliveringOrdersStatus(this.userData.api_token);
    
    deliveryStatus$.subscribe(response=> {
      if (response.success) {
        this.utils.showToast(response.message, {position: 'bottom'})
      }
    })
  }


  goToRequestPage(request) {
    this.navCtrl.push('RequestPage', {request})
  }

}
