import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController, Events, NavController } from 'ionic-angular';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { OrdersProvider } from '../../providers/orders/orders';
import { UtilsProvider } from '../../providers/utils/utils';
import { RequestAction, UserData, DriverOrder } from '../../providers/types/app-types';
import { AudioProvider } from '../../providers/audio/audio';


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

  constructor(public viewCtrl: ViewController,
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
    
    this.userData = await  this.appStorage.getUserData();
    this.playCounter();
    this.getRequestDetails();
    this.audioProvider.activateNotifySound();
  }

  playCounter() {

    let interval = setInterval(() => {
      let [minutes, seconds] = [this.counter.getMinutes(), this.counter.getSeconds()];
      this.counter = new Date(this._next10 - +Date.now());

      if(minutes <= 0 && seconds<= 0) {
        clearInterval(interval);
        this.countIsOver = true;
        this.onClick('cancel');
      }
    }, 1000);

  }

  getRequestDetails() {
    const request$ = this.orderProvider.getOrderDetails(this.data.order_id, this.userData.api_token);

    request$.subscribe(response => {
      console.log(response);
      if (response.success) {
        this.driverOrder = response.data.order;
      }

    })
  }

  goToRequestPage(request, params) {
    this.navCtrl.push('RequestPage', {request, ...params})
  }

  
  onClick(requetAction : keyof RequestAction) {
    switch (requetAction) {
      case 'accept':
        this.acceptRequest();
        break;
      case 'await':
        this.showModal();
        break;
      case 'cancel':
        this.cancelRequest();
        break;
    }
  }

  showModal() {
    const modal = this.modalCtrl.create('DelayorderPage');

    modal.onDidDismiss(accept => {
      if (accept) {
        this.awaitRequest();
      }
    })

    modal.present();
  }

  private acceptRequest() {
    this.orderProvider.acceptOrder(this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status
          this.events.publish('updateOrders');

        }
        this.utils.showToast(response.message);
        this.dismiss();
      })
  }

  private awaitRequest() {
    this.orderProvider.awaitOrder(this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status
          this.events.publish('updateOrders');
        }
        this.utils.showToast(response.message);
        this.dismiss();
      })
  }


  private cancelRequest() {
    this.orderProvider.refuseOrder(this.driverOrder.id, this.userData.api_token)
      .subscribe(response => {
        console.log({response});
        if (response.success) {
          this.driverOrder.status = response.data.order.status;
          this.events.publish('updateOrders');

        }
        this.utils.showToast(response.message);
        this.dismiss();

      })
  }

  goToUserPage() {
    this.navCtrl.push('UserPage', {user: this.driverOrder.order.user, orderId: this.driverOrder.id, orderStatus: this.driverOrder.status});
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
