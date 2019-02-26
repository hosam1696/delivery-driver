import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { OrdersProvider } from '../../providers/orders/orders';
import { UtilsProvider } from '../../providers/utils/utils';


@IonicPage()
@Component({
  selector: 'page-waitingorders',
  templateUrl: 'waitingorders.html',
})
export class WaitingordersPage {
  isRecievingRequests:boolean;
  userData: UserData;
  allOrders: any[];

  
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

    orders$.subscribe(data => {
      console.log({waitingOrders: data});
    })
  }

  onToggleChange(event) {
    this.isRecievingRequests = event.value;
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


}
