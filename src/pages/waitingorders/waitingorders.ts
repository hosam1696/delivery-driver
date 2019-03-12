import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DriverOrder, UserData} from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { OrdersProvider } from '../../providers/orders/orders';
import { UtilsProvider } from '../../providers/utils/utils';
import { AuthProvider } from '../../providers/auth/auth';


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
               private authProvider: AuthProvider,
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
    const deliveryStatus$ = this.authProvider.updateProfile({current_password: this.userData.current_password ,availability: +this.userData.availability},this.userData.api_token);
    
    deliveryStatus$.subscribe(response=> {
      if (response.success) {
        const availability = response.data.driver.availability;
        this.utils.showToast(response.message, {position: 'bottom'});
        this.appStorageProvider.setUserData({...this.userData, availability});
      } 
    })
  }


  goToRequestPage(request) {
    this.navCtrl.push('RequestPage', {request})
  }

}
