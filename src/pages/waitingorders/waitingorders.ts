import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
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
               private events: Events,
               private utils: UtilsProvider,
               ) {
  }

  
  async ionViewWillEnter() {
    this.userData = await this.appStorageProvider.getUserData();
  }
  
  
  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();
    console.log({userData: this.userData});
    this.getWaitingOrders();

    this.events.subscribe('update:storage', () => {
      this.appStorageProvider.getUserData()
        .then(userData => this.userData = userData)
    });
  }


  private getWaitingOrders() {

    const orders$ = this.ordersProvider.getWaitingOrders(this.userData.api_token);

    orders$.subscribe(response => {
      console.log({waitingOrders: response});
      if (response.success) {
        this.allRequests = response.data.orders;
      } else if (response.error == 'Unauthenticated') {
        const authLogin$ = this.authProvider.login({username: this.userData.userName, password: this.userData.current_password});
        
        authLogin$.subscribe(response => {
          if (response.success) {
  
            Promise.all([
              this.appStorageProvider.setUserData({...response.data.user}),
              this.appStorageProvider.saveToken(response.data.user.api_token)
            ]).then((data) => {
              this.userData = data[0];
              this.getWaitingOrders();
            })
          }
        })
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
        const availability = +response.data.driver.availability;
        this.utils.showToast(response.message, {position: 'bottom'});
        this.appStorageProvider.setUserData({...this.userData, availability})
          .then( (data) => {
            console.log({savedUserInWaitingOrders: data});
            this.events.publish('update:storage');
          })
      } 
    })
  }


  goToRequestPage(request) {
    this.navCtrl.push('RequestPage', {request})
  }

}
