import {Component, Inject} from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {AppstorageProvider} from '../../providers/appstorage/appstorage';
import {OrdersProvider} from '../../providers/orders/orders';
import {UtilsProvider} from '../../providers/utils/utils';
import {DriverOrder, OrderStatus, RequestAction, UserData, EVENTS} from '../../providers/types/app-types';
import {AudioProvider} from '../../providers/audio/audio';


@IonicPage()
@Component({
  selector: 'page-notificationpopup',
  templateUrl: 'notificationpopup.html',
})
export class NotificationpopupPage {
  data = this.navParams.get('orderData');
  driverOrder: DriverOrder;
  userData: UserData;
  private _next10 = +Date.now() + 1000 * 60 * 10;
  counter = new Date(this._next10 - +Date.now());
  countIsOver: boolean = false;
  apiKey: string;

  constructor(
    @Inject('DOMAIN_URL') public domainUrl,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private appStorage: AppstorageProvider,
    private orderProvider: OrdersProvider,
    private utils: UtilsProvider,
    private audioProvider: AudioProvider,
    private events: Events
  ) {
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorage.getUserData();
    this.apiKey = await this.appStorage.getSavedToken();
    // this.playCounter();
    this.getRequestDetails();
    this.audioProvider.activateNotifySound();
  }

  playCounter() {

    let interval = setInterval(() => {
      let [minutes, seconds] = [this.counter.getMinutes(), this.counter.getSeconds()];
      this.counter = new Date(this._next10 - +Date.now());

      if (minutes <= 0 && seconds <= 0) {
        clearInterval(interval);
        this.countIsOver = true;
        this.onClick('cancel');
      }
    }, 1000);

  }

  getRequestDetails() {
    const request$ = this.orderProvider.getOrderDetails(this.data.order_id, this.userData.api_token || this.apiKey);

    request$.subscribe(response => {
      if (response.success) {
        this.driverOrder = response.data.order;
      }
    })
  }

  goToRequestPage(request, params) {
    this.navCtrl.push('RequestPage', {request, ...params})
  }


  onClick(requestAction: keyof RequestAction) {
    switch (requestAction) {
      case 'accept':
        this.changeOrderStatus(OrderStatus.accepted);
        break;
      case 'await':
        this.showModal();
        break;
      case 'cancel':
        this.changeOrderStatus(OrderStatus.refused);
        break;
    }
  }

  showModal() {
    const modal = this.modalCtrl.create('DelayorderPage');

    modal.onDidDismiss(accept => {
      accept && this.changeOrderStatus(OrderStatus.waiting);
    });

    modal.present();
  }

  private changeOrderStatus(orderStatus: OrderStatus): void {
    this.orderProvider.changeOrderStatus(orderStatus, this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        if (response.success) {
          this.driverOrder.status = response.data.order.status;
          this.events.publish(EVENTS.UPDATE_ORDERS);
          if (orderStatus == OrderStatus.accepted) {
            this.navCtrl.push('UserPage', {
            user: this.driverOrder.order.user,
            orderId: this.driverOrder.id,
            orderStatus: this.driverOrder.status,
            driverOrder: this.driverOrder.order
            });
          }
        }
        response.message && this.utils.showToast(response.message);
        this.dismiss();
      })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  fillImgSrc(src: string): string {
    return src.startsWith('/storage') ? this.domainUrl.concat(src) : src;
  }
}
