import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import {DriverOrder, OrderStatus, UserData} from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';
import { AudioProvider } from '../../providers/audio/audio';
import { AuthProvider } from '../../providers/auth/auth';


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
              private authProvider: AuthProvider,
              private utils: UtilsProvider,
              private popOverCtrl: PopoverController,
              private audioProvider: AudioProvider,
              private events: Events
              ) {
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.getAllOrders();

    this.audioProvider.activateBtnSound();

    this.events.subscribe('updateOrders', () => {
      this.getAllOrders();
    })
  }


  private getAllOrders() {

    const orders$ = this.ordersProvider.getAllOrders(this.userData.api_token);

    orders$.subscribe(response => {
      console.log({ordersResponse: response});
      if (response.success)
      this.allRequests = this.requests = response.data.orders;
    })
  }

  onToggleChange(event) {
    this.isReceivingRequests = event.value;
    this.changeOrderStatus();
  }


  changeOrderStatus() {
    const deliveryStatus$ = this.authProvider.updateProfile({current_password: this.userData.current_password ,availability: +this.userData.availability}, this.userData.api_token);
    
    deliveryStatus$.subscribe(response=> {
      
      if (response.success) {
        const availability = response.data.driver.availability;
        this.utils.showToast(response.message, {position: 'bottom'});
        this.appStorageProvider.setUserData({...this.userData, availability});
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

  onRefresh(event) {
    this.ionViewDidLoad();

    setTimeout(() => {
      event.complete();
    }, 1000)
  }
}
