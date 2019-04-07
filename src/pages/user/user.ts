import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import {User, UserData} from "../../providers/types/app-types";
import { OrdersProvider } from '../../providers/orders/orders';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';
import {LaunchNavigator, LaunchNavigatorOptions} from "@ionic-native/launch-navigator";


@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  requestUser: User = this.navParams.get('user');
  orderId = this.navParams.get('orderId');
  orderStatus = this.navParams.get('orderStatus');
  driverOrder = this.navParams.get('driverOrder');
  userData: UserData;

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              private ordersProvider: OrdersProvider,
              private launchNavigator: LaunchNavigator,
              private events: Events,
              private utils: UtilsProvider,
              private appStorageProvider: AppstorageProvider,
              public navParams: NavParams) {
    console.log({requestStatus: this.orderStatus})
    console.log({driverOrder: this.driverOrder})

  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();
  }

  goToMaps() {
    this.navCtrl.push('MapPage', {user: this.requestUser})
  }


  showOnMaps(destination) {
    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };
    this.launchNavigator.navigate(destination, options);
  }

  showModal() {
    const modal = this.modalCtrl.create('RefusemsgPage');

    modal.onDidDismiss(data => {
      if (data.msg && data.msg.trim()) {
        this.refuseOffer(data.msg);
      }
    })

    modal.present();
  }

  refuseOffer(msg) {
    this.ordersProvider.cancelOrder(this.orderId, this.userData.api_token, msg)

      .subscribe(response =>{ 
        console.log(response);
        if (response.success) {
          this.events.publish('updateOrders');
          this.utils.showToast(response.message);
          setTimeout(() => {
            this.navCtrl.setRoot('RequestsPage')
          }, 1000)
        }
      })
  }

  onDeliver() {
    this.ordersProvider.deliverOrder(this.orderId, this.userData.api_token)

    .subscribe(response =>{ 
      if (response.success) {
        this.events.publish('updateOrders');
        this.utils.showToast(response.message);
        this.orderStatus = 'completed';
        this.driverOrder.status = 'completed';
      }
    })
  }

  onReceiving() {
    this.ordersProvider.receiveOrder(this.orderId, this.userData.api_token)

      .subscribe(response =>{
        if (response.success) {
          this.events.publish('updateOrders');
          this.utils.showToast(response.message);
          this.driverOrder.status = 'ongoing';
          this.orderStatus = 'ongoing';

        }
      })
  }


  openCompanyLocation() {
    const location = [+this.driverOrder.company.lat, +this.driverOrder.company.long];
    console.log({location});
    this.showOnMaps(location);

    this.onProcessing();
  }

  onProcessing() {
    this.ordersProvider.processOrder(this.orderId, this.userData.api_token)

    .subscribe(response =>{
      if (response.success) {
        this.events.publish('updateOrders');
        this.driverOrder.status = 'processing';
        this.orderStatus = 'processing';

      }
    })
  }

  openUserLocation() {
    const location = [+this.requestUser.lat, +this.requestUser.long];
    this.showOnMaps(location);

  }
}
