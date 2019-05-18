import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {DriverOrder, OrderStatus, UserData} from '../../providers/types/app-types';
import {AppstorageProvider} from '../../providers/appstorage/appstorage';
import {OrdersProvider} from '../../providers/orders/orders';
import {UtilsProvider} from '../../providers/utils/utils';
import {AuthProvider} from '../../providers/auth/auth';
import {forkJoin} from "rxjs/observable/forkJoin";

@IonicPage()
@Component({
  selector: 'page-waitingorders',
  templateUrl: 'waitingorders.html',
})
export class WaitingordersPage {
  isReceivingRequests: boolean;
  userData: UserData;
  allRequests: DriverOrder[];
  pageStatus:  OrderStatus = this.navParams.get('pageStatus');

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appStorageProvider: AppstorageProvider,
              private ordersProvider: OrdersProvider,
              private authProvider: AuthProvider,
              private events: Events,
              private utils: UtilsProvider,
  ) {

    this.events.subscribe('getWaitingOrders', () => {
      this.pageStatus = OrderStatus.waiting;
      this.getOrders();
    });

    this.events.subscribe('update:storage', () => {
      this.appStorageProvider.getUserData().then(userData => this.userData = userData)
    });
  }

  async ionViewWillEnter() {
    this.userData = await this.appStorageProvider.getUserData();
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.getAccordingOrders();
  }

  private getAccordingOrders() {

    if (this.pageStatus == OrderStatus.canceled) {
      this.getCanceledOrders();
    } else {
      this.getOrders();
    }
  }

  private getOrders(): void {
    const orders$ = this.ordersProvider.getDriverOrders(this.userData.api_token, this.pageStatus);

    orders$.subscribe(response => {
      console.log({waitingOrders: response});
      if (response.success) {
        this.allRequests = response.data.orders;
      } else if (response.error == 'Unauthenticated') {
        this.events.publish('handle:unAuthorized', (data) => {
          this.userData = data[0];
          this.getAccordingOrders();
        })
      }
    })

  }

  private getCanceledOrders() {

    const orders$ = forkJoin(
      this.ordersProvider.getDriverOrders(this.userData.api_token, OrderStatus.refused),
      this.ordersProvider.getDriverOrders(this.userData.api_token, OrderStatus.canceled));

    orders$.subscribe(responses => {
      console.log({cancelRequest: responses});
      responses.forEach(response => {
        if (response.success) {
          if (!this.allRequests)
            this.allRequests = [];
          responses.forEach(response => {
            this.allRequests = Array.from(new Set(this.allRequests.concat(response.data.orders)));
          })
        } else if (response.error == 'Unauthenticated') {
          this.events.publish('handle:unAuthorized', (data) => {
            this.userData = data[0];
            this.getAccordingOrders();
          })
        }
      })
    })
  }

  onToggleChange(event) {
    this.isReceivingRequests = event.value;
    this.changeAvailabilityStatus();
  }

  changeAvailabilityStatus() {
    const deliveryStatus$ = this.authProvider.updateProfile({
      current_password: this.userData.current_password,
      availability: +this.userData.availability
    }, this.userData.api_token);

    deliveryStatus$.subscribe(response => {
      if (response.success) {
        const availability = +response.data.driver.availability;
        this.utils.showToast(response.message, {position: 'bottom'});
        this.appStorageProvider.setUserData({...this.userData, availability})
          .then((data) => {
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
