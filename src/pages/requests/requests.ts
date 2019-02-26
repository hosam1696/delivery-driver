import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import { UserData } from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';


@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  isRecievingRequests:boolean;
  userData: UserData;
  allOrders: any[];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appStorageProvider: AppstorageProvider,
              private ordersProvider: OrdersProvider,
              private utils: UtilsProvider
              ) {
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.getAllOrders()
  }


  private getAllOrders() {

    const orders$ = this.ordersProvider.getAllOrders(this.userData.api_token);

    orders$.subscribe(data => {
      console.log({orders: data});
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
