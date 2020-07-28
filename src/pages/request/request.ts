import {Component, Inject} from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {OrdersProvider} from "../../providers/orders/orders";
import {DriverOrder, Order, OrderStatus, UserData, EVENTS} from "../../providers/types/app-types";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {UtilsProvider} from "../../providers/utils/utils";
import { LaunchNavigator, LaunchNavigatorOptions } from "@ionic-native/launch-navigator";


@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
})
export class RequestPage {
  request: Order;
  driverOrder: DriverOrder;
  userData: UserData;
  fromPop: boolean = this.navParams.get('fromPop');

  constructor(@Inject('DOMAIN_URL') public domainUrl,
              public navCtrl: NavController,
              public navParams: NavParams,
              private modalCtrl: ModalController,
              private launchNavigator: LaunchNavigator,
              private appStorage: AppstorageProvider,
              private orderProvider: OrdersProvider,
              private utils: UtilsProvider,
              private events: Events
  ) {
  }

  async ionViewDidLoad() {
    console.log(this.navParams.get('request'));
    this.driverOrder = this.navParams.get('request');
    this.userData = await this.appStorage.getUserData();

    this.getRequestDetails();
  }

  getRequestDetails() {
    const request$ = this.orderProvider.getOrderDetails(this.driverOrder.id, this.userData.api_token);


    request$.subscribe(response => {
      console.log(response);
      if (response.success) {
        this.driverOrder = response.data.order;
      }

    })
  }


  onClick(requestAction: OrderStatus | string) {
    switch (requestAction) {
      case OrderStatus.accepted:
        this.changeOrderStatus(OrderStatus.accepted);
        break;
      case OrderStatus.waiting:
        this.showModal();
        break;
      case OrderStatus.refused:
        this.changeOrderStatus(OrderStatus.refused);
        break;
    }
  }

  showModal() {
    const modal = this.modalCtrl.create('DelayorderPage');

    modal.onDidDismiss(accept => {
      if (accept) {
        this.changeOrderStatus(OrderStatus.waiting);
      }
    });

    modal.present();
  }

  private changeOrderStatus(orderStatus: OrderStatus):void {
    this.orderProvider.changeOrderStatus(orderStatus, this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status;
          this.events.publish(EVENTS.UPDATE_ORDERS);
          if (orderStatus === OrderStatus.waiting) {
            this.navCtrl.push('WaitingordersPage');
          }
        }
        response.message && this.utils.showToast(response.message)
      })

  }

  goToUserPage() {
    this.navCtrl.push('UserPage', {
      user: this.driverOrder.order.user,
      orderId: this.driverOrder.id,
      orderStatus: this.driverOrder.status,
      driverOrder: this.driverOrder.order
    });
  }

  isLinkUrl(link: string): boolean {
    return link.startsWith('http') || link.startsWith('https') 
  }

  isNumber(num): boolean {
    return  Number.isInteger(Number(num))
  }

  fillImgSrc(src: string): string {
    return src.startsWith('/storage') ? this.domainUrl.concat(src) : src;
  }

  openCompanyLocation() {
    const location = [+this.driverOrder.order.company.lat, +this.driverOrder.order.company.long];
    console.log({ location });
    this.showOnMaps(location);
  }


  openOrderLocation() {
    const location = [+this.driverOrder.order.lat, +this.driverOrder.order.lng];
    console.log({ OrderLocation: location });
    this.showOnMaps(location);
  }

  showOnMaps(destination) {
    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };
    this.launchNavigator.navigate(destination, options);
  }
}
