import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController, Events, NavController } from 'ionic-angular';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { OrdersProvider } from '../../providers/orders/orders';
import { UtilsProvider } from '../../providers/utils/utils';
import { RequestAction, UserData, DriverOrder } from '../../providers/types/app-types';


@IonicPage()
@Component({
  selector: 'page-notificationpopup',
  templateUrl: 'notificationpopup.html',
})
export class NotificationpopupPage {
  data = this.navParams.get('orderData');
  driverOrder: DriverOrder;
  userData: UserData;

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private appStorage: AppstorageProvider,
    private orderProvider: OrdersProvider,
    private utils: UtilsProvider,
    private events: Events
) {
}
  async ionViewDidLoad() {
    
    this.userData = await  this.appStorage.getUserData();

    this.getRequestDetails();
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

  goToRequestPage(request) {
    this.navCtrl.push('RequestPage', {request})
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
