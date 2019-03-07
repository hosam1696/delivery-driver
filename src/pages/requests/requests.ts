import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import {DriverOrder, OrderStatus, UserData} from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';
import { AudioProvider } from '../../providers/audio/audio';


@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  isReceivingRequests:boolean;
  userData: UserData;
  allRequests: DriverOrder[];
  requests: DriverOrder[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appStorageProvider: AppstorageProvider,
              private ordersProvider: OrdersProvider,
              private utils: UtilsProvider,
              private popOverCtrl: PopoverController,
              private audioProvider: AudioProvider
              ) {
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.getAllOrders();

    this.audioProvider.activateBtnSound();
  }


  private getAllOrders() {

    const orders$ = this.ordersProvider.getAllOrders(this.userData.api_token);

    orders$.subscribe(response => {
      console.log({ordersResponse: response});
      this.allRequests = this.requests = response.data.orders;
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

  showPopOver(ev) {
    const popover = this.popOverCtrl.create('OrdersstatesPage');

    popover.onDidDismiss(data=> {
      if (data != null) {
        console.log('data from popover', {data});
        if (data == 0) {
          this.requests = this.allRequests;
        } else  {
          this.requests = this.allRequests.filter(req=> req.order.status == OrderStatus[data]);
        }
      }
    })

    popover.present({
      ev
    });
  }

  goToRequestPage(request) {
    this.navCtrl.push('RequestPage', {request})
  }
}
