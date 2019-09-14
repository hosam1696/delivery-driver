import {Component, Inject} from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Order, OrderStatus, User, UserData, EVENTS} from "../../providers/types/app-types";
import {OrdersProvider} from '../../providers/orders/orders';
import {AppstorageProvider} from '../../providers/appstorage/appstorage';
import {UtilsProvider} from '../../providers/utils/utils';
import {LaunchNavigator, LaunchNavigatorOptions} from "@ionic-native/launch-navigator";
import { CallNumber } from '@ionic-native/call-number';


@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {
  requestUser: User = this.navParams.get('user');
  orderId = this.navParams.get('orderId');
  orderStatus: string = this.navParams.get('orderStatus');
  driverOrder: Order = this.navParams.get('driverOrder');
  userData: UserData;

  constructor(
    @Inject('DOMAIN_URL') public domainUrl,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private ordersProvider: OrdersProvider,
    private launchNavigator: LaunchNavigator,
    private events: Events,
    private utils: UtilsProvider,
    private callNumber: CallNumber,
    private appStorageProvider: AppstorageProvider,
    public navParams: NavParams) {
    // console.log({requestStatus: this.orderStatus})
    // console.log({driverOrder: this.driverOrder});
    // console.log({paramsData: this.navParams.data})

  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();


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
        this.cancelOffer(data.msg);
      }
    });

    modal.present();
  }

  cancelOffer(msg) {
    this.ordersProvider
      .changeOrderStatus(OrderStatus.canceled, this.orderId, this.userData.api_token, msg)
      .subscribe(response => {
        console.log(response);
        if (response.success) {
          this.utils.showToast(response.message);
          this.navCtrl.pop();
          this.events.publish(EVENTS.UPDATE_ROOT, 'RequestsPage');        
          this.events.publish(EVENTS.UPDATE_ORDERS);
        }
      })
  }

  onDeliver() {
    this.ordersProvider
      .changeOrderStatus(OrderStatus.completed,this.orderId, this.userData.api_token)
      .subscribe(response => {
        if (response.success) {
          this.events.publish(EVENTS.UPDATE_ORDERS);
          this.utils.showToast(response.message);
          this.orderStatus = 'completed';
          this.driverOrder.status = 'completed';
          setTimeout(() => {
            this.navCtrl.popToRoot();
          }, 500)
        }
      })
  }

  onReceiving() {
    this.ordersProvider
      .changeOrderStatus(OrderStatus.received, this.orderId, this.userData.api_token)
      .subscribe(response => {
        if (response.success) {
          this.events.publish(EVENTS.UPDATE_ORDERS);
          this.utils.showToast(response.message);
          this.driverOrder.status = 'received';
          this.orderStatus = 'received';
        }
      })
  }

  onOngoing() {
    this.ordersProvider
      .changeOrderStatus(OrderStatus.ongoing, this.orderId, this.userData.api_token)
      .subscribe(response => {
        if (response.success) {
          this.events.publish(EVENTS.UPDATE_ORDERS);
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
    this.ordersProvider
      .changeOrderStatus(OrderStatus.processing, this.orderId, this.userData.api_token)
      .subscribe(response => {
        if (response.success) {
          this.events.publish(EVENTS.UPDATE_ORDERS);
          this.driverOrder.status = 'processing';
          this.orderStatus = 'processing';
        }
      })
  }

  openOrderLocation() {
    const location = [+this.driverOrder.lat, +this.driverOrder.lng];
    console.log({OrderLocation: location});
    this.showOnMaps(location);
    this.onOngoing();
  }

  onReturned() {
    const modal = this.modalCtrl.create('RefusemsgPage', {action: 'return'});

    modal.onDidDismiss(data => {
      console.log({data});
      if (data.msg && data.msg.trim() && data.action === 'return') {
        this.returnOrder(data.msg);
      }
    });

    modal.present();
  }

  private returnOrder(msg: string): void {
    this.ordersProvider
      .changeOrderStatus(OrderStatus.returned, this.orderId, this.userData.api_token, msg)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status;
          this.orderStatus = this.driverOrder.status;
          this.navCtrl.pop();
          this.events.publish(EVENTS.UPDATE_ROOT, 'RequestsPage');        
          this.events.publish(EVENTS.UPDATE_ORDERS);
        }
        this.utils.showToast(response.message)
      })
  }

  dialNumber(number: string): void {
    this.callNumber.callNumber(number, true).then();
  }

  fillImgSrc(src: string): string {

    return src.startsWith('/storage') ? this.domainUrl.concat(src) : src;
  }
}
