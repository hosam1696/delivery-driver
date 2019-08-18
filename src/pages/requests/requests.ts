import {Component} from '@angular/core';
import {
  AlertController,
  AlertOptions,
  Events,
  IonicPage, ModalController,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {OrdersProvider} from '../../providers/orders/orders';
import {DriverOrder, OrderStatus, UserData, EVENTS} from '../../providers/types/app-types';
import {AppstorageProvider} from '../../providers/appstorage/appstorage';
import {UtilsProvider} from '../../providers/utils/utils';
import {AudioProvider} from '../../providers/audio/audio';
import {AuthProvider} from '../../providers/auth/auth';
import {Network} from '@ionic-native/network';
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {Diagnostic} from "@ionic-native/diagnostic";
import { forkJoin } from 'rxjs/observable/forkJoin';
import { map } from 'rxjs/operators';

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
  isFiltering: boolean = false;
  disconnect$;
  connect$;
  currentLocation: {lat: number, long: number};
  locationInterval;
  initOrders: DriverOrder[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appStorageProvider: AppstorageProvider,
              private ordersProvider: OrdersProvider,
              private authProvider: AuthProvider,
              private modalCtrl: ModalController,
              private utils: UtilsProvider,
              private popOverCtrl: PopoverController,
              private network: Network,
              private geolocation: Geolocation,
              private diagnostic: Diagnostic,
              private alertCtrl: AlertController,
              private audioProvider: AudioProvider,
              private events: Events
              ) {

                this.disconnect$ = this.network.onDisconnect()
                .subscribe(()=> {
                  this.utils.showToast('التطبيق يتطلب الاتصال بالانترنت');
                });
          
                this.connect$ = this.network.onDisconnect()
                .subscribe(()=> {
          
                  setTimeout(() => {
                    this.getAllOrders();
                  }, 3000);
                })
          
  }

  async ionViewWillEnter() {
    this.userData = await this.appStorageProvider.getUserData();
    this.checkLocation();
    this.getOrdersCount();
    this.locationInterval = setInterval(() => {
      this.checkLocation();
    }, 1000 * 60 * 5);
  }

  getOrdersCount() {
    const ordersStatus: Array<OrderStatus> = [ OrderStatus.waiting,  OrderStatus.completed, OrderStatus.returned] 
    const orders$ = forkJoin(
    ...ordersStatus.map(status => this.ordersProvider.getDriverOrders(this.userData.api_token, status))
    )
    orders$.subscribe((responses:any[]) => {
      let ordersCount = responses.map(response => {
      if (response.success&&response.data.orders) {
        return response.data.orders.length;
      } else {
        return 0
      }
    })
      console.log(ordersCount)
    })


  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.checkConnection();

    this.getAllOrders();

    this.audioProvider.activateBtnSound();

    this.subscribeToEvents();

  }

  private subscribeToEvents() {
    this.events.subscribe(EVENTS.UPDATE_ORDERS, () => {
      this.getAllOrders(false);
    });

    this.events.subscribe(EVENTS.UPDATE_STORAGE, () => {
      this.appStorageProvider.getUserData().then(userData => this.userData = userData)
    });
  }

  private checkConnection() {
    this.disconnect$ = this.network.onDisconnect()
      .subscribe(()=> {
        this.utils.showToast('تعذر الاتصال بالانترنت');
      });

    this.connect$ = this.network.onDisconnect()
      .subscribe(()=> {
        setTimeout(() => this.getAllOrders(), 3000);
      });
  }

  ionViewWillLeave() {
    this.disconnect$.unsubscribe();
    this.connect$.unsubscribe();

    clearInterval(this.locationInterval);

  }

  private getAllOrders(withCheck = true) {

    const orders$ = this.ordersProvider.getDriverOrders(this.userData.api_token);
    orders$.subscribe(response => {
      if (response.success) {
        this.allRequests = this.requests = this.checkDelayedOrders(response.data.orders);
        withCheck && this.checkProcessingOrders();
      } else if (response.error == 'Unauthenticated' || response.error == 'Unauthenticated.') {
        // show Hint to app user the user has been logged before by this account, he have to login againg to refresh token
        this.utils.showToast('التطبيق يعمل على جهاز اخر.');
        // Try to Login Again
        this.events.publish(EVENTS.HANDLE_UNAUTHORIZATION, (data) => {
          this.userData = data[0];
          this.events.publish(EVENTS.UPDATE_STORAGE);
          this.getAllOrders();
        });

      }
    }, err => {
      console.warn(err);
    })
  }

  openInitOrder() {
    let orderId = this.initOrders.shift().id;
    const modal = this.modalCtrl.create('NotificationpopupPage', {orderData: {wasTapped: false, order_id: orderId}});

    modal.present();
  }

  onToggleChange(event) {
    this.isReceivingRequests = event.value;
    this.changeAvailabilityStatus();
  }

  private checkDelayedOrders(orders: DriverOrder[]): DriverOrder[] {
    let actionOrders = orders.filter(order =>(order.status =='accepted'  || order.status == 'received' || order.status == 'processing' || order.status == 'ongoing' ) && order.order.first_item);

    this.initOrders = orders.filter(order => order.status == 'init');

    return actionOrders;
  }

  private checkProcessingOrders(): void {
    // get the first in delivering state order
    const processingOrder: DriverOrder = this.allRequests.find((order:DriverOrder) => order.status == 'ongoing' || order.status == 'received' || order.status == 'processing');
    console.log(this.requests,{processingOrder})
    processingOrder && this.getRequestDetails(processingOrder.id);
  }

  
  private getRequestDetails(requestId: number):void {
    const request$ = this.ordersProvider.getOrderDetails(requestId, this.userData.api_token);

    request$.subscribe(response => {
      if (response.success) {
        const currentProcessingOrder: DriverOrder = response.data.order;
        this.goToDeliveryPage(currentProcessingOrder);
      }
    })
  }

  private goToDeliveryPage(driverOrder: DriverOrder): void {
    this.navCtrl.push('UserPage', {user: driverOrder.order.user, orderId: driverOrder.id, orderStatus: driverOrder.status, driverOrder: driverOrder.order});
  } 

  changeAvailabilityStatus() {
    const deliveryStatus$ = this.authProvider.updateProfile({current_password: this.userData.current_password ,availability: +this.userData.availability}, this.userData.api_token);
    
    deliveryStatus$.subscribe(response=> {
      
      if (response.success) {
        const availability = +response.data.driver.availability;
        console.log(this.userData.availability, response.data.driver.availability);
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
          this.isFiltering = false;
          this.requests = this.allRequests;
        } else  {
          this.isFiltering = true;
          this.requests = this.allRequests.filter(req => req.status == OrderStatus[data]);
        }
      }
    });

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

  private updateDelegateLocation() {

    this.authProvider.updateLocation(this.currentLocation, this.userData.api_token).subscribe()

  }



    private getCurrentLoaction() {
      const geolocate = this.geolocation.getCurrentPosition();

      geolocate.then((data: Geoposition) => {
        this.currentLocation = {lat:data.coords.latitude, long:data.coords.longitude};
        this.updateDelegateLocation();
      }).catch(() => {
        this.checkLocation();
      })
    }

  private checkLocation() {
      this.diagnostic.isGpsLocationEnabled().then(e => {
        if (!e) {
          this.showAlert().then(state => {
            if (state == "ok") {
              this.diagnostic.requestLocationAuthorization();
              this.diagnostic.switchToLocationSettings();
              this.diagnostic.isLocationEnabled()
                .then(() => {
                  //TODO: check if the delegate is on ongoing or delivering order
                  if (this.delegateIsAvailable) {
                    this.getCurrentLoaction();
                  }
                })
            }
          });
        } else {
          //TODO: check if the delegate is on ongoing or delivering order
          if (this.delegateIsAvailable) {
            this.getCurrentLoaction();
          }
        }
      });
    }

    showAlert() {
      return new Promise((resolve, reject) => {
        const options: AlertOptions = {
          title: "الموقع",
          subTitle: " للاستمرار يرجى تفعيل GPS",
          buttons: [
            {
              text: "لا شكرا",
              role: "cancel",
              handler: () => {
                resolve("cancel");
                reject('cancel');
              }
            },
            {
              text: "موافق",
              handler: () => {
                resolve("ok");
              }
            }
          ]
        };

        const alert = this.alertCtrl.create(options);

        alert.present();
      });
    }

    private get delegateIsAvailable(): boolean {
    return +this.userData.availability == 1 && this.allRequests && this.allRequests.every(request => request.status != 'ongoning' && request.status != 'processing');
    }
}
