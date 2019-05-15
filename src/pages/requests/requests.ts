import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  Events,
  AlertController,
  AlertOptions
} from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import {DriverOrder, OrderStatus, UserData} from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';
import { AudioProvider } from '../../providers/audio/audio';
import { AuthProvider } from '../../providers/auth/auth';
import { Network } from '@ionic-native/network';
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import { Diagnostic } from "@ionic-native/diagnostic";

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appStorageProvider: AppstorageProvider,
              private ordersProvider: OrdersProvider,
              private authProvider: AuthProvider,
              private utils: UtilsProvider,
              private popOverCtrl: PopoverController,
              private network: Network,
              private geolocate: Geolocation,
              private diagnostic: Diagnostic,
              private alertCtrl: AlertController,
              private audioProvider: AudioProvider,
              private events: Events
              ) {

                this.disconnect$ = this.network.onDisconnect()
                .subscribe(()=> {
                  this.utils.showToast('التطبيق يتطلب الاتصال بالانترنت');
                })
          
                this.connect$ = this.network.onDisconnect()
                .subscribe(()=> {
          
                  setTimeout(() => {
                    let connectionType = this.network.type;
                    this.getAllOrders();
                    console.log({connectionType});
                  }, 3000);
                })
          
  }

  async ionViewWillEnter() {
    this.userData = await this.appStorageProvider.getUserData();
    this.checkLocation();

    this.locationInterval = setInterval(() => {
      this.checkLocation();
    }, 1000 * 60 * 5);
  }

  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.checkConnection();

    this.getAllOrders();

    this.audioProvider.activateBtnSound();

    this.subscribeToEvents();

  }

  private subscribeToEvents() {
    this.events.subscribe('updateOrders', () => {
      this.getAllOrders(false);
    });

    this.events.subscribe('update:storage', () => {
      this.appStorageProvider.getUserData()
        .then(userData => this.userData = userData)
    });
  }

  private checkConnection() {
    this.disconnect$ = this.network.onDisconnect()
      .subscribe(()=> {
        this.utils.showToast('تعذر الاتصال بالانترنت');
      })

    this.connect$ = this.network.onDisconnect()
      .subscribe(()=> {
        setTimeout(() => this.getAllOrders(), 3000);
      })
  }

  ionViewWillLeave() {
    this.disconnect$.unsubscribe();
    this.connect$.unsubscribe();

    clearInterval(this.locationInterval);

  }

  private getAllOrders(withCheck = true) {

    const orders$ = this.ordersProvider.getAllOrders(this.userData.api_token);

    orders$.subscribe(response => {
      // console.log({ordersResponse: response});
      if (response.success) {
        this.allRequests = this.requests = this.checkDelayedOrders(response.data.orders);
        withCheck && this.checkProcessingOrders();
      } else if (response.error == 'Unauthenticated' || response.error == 'Unauthenticated.') {
        // show Hint to app user the user has been logged before by this account, he have to login againg to refresh token
        this.utils.showToast('التطبيق يعمل على جهاز اخر.');

        // Try to Login Again
        this.handleUnAuthenticatedResult();
      }
    }, err => {
      console.warn(err);
    })
  }

  private handleUnAuthenticatedResult():void {
    const authLogin$ = this.authProvider.login({username: this.userData.userName, password: this.userData.current_password});
        
    authLogin$.subscribe(response => {
      if (response.success) {
        Promise.all([
          this.appStorageProvider.setUserData({...response.data.user}),
          this.appStorageProvider.saveToken(response.data.user.api_token)
        ]).then((data) => {
          this.userData = data[0];
          this.events.publish('update:storage');
          this.getAllOrders();
        })
      }
    })
  }

  onToggleChange(event) {
    console.log(event.value);
    this.isReceivingRequests = event.value;
    this.changeOrderStatus();
  }

  private checkDelayedOrders(orders: DriverOrder[]): DriverOrder[] {
    let allOrders, supposedTime = 1000 * 60 * 10 , dateNow = +Date.now(),
     isExceededTime = order => dateNow - +new Date(order.created_at) > supposedTime;

    allOrders = orders.filter(order => order.status != 'init' && (order.status == 'processing' || order.status == 'ongoing'));
    // Change the status of exceeded delayed order
    orders.filter(order => isExceededTime(order) && order.status == 'init').forEach(order => this.cancelRequest(order.id));

    return allOrders;
  }

  private checkProcessingOrders(): void {
    // get the first in delivering state order
    const processingOrder: DriverOrder = this.allRequests.find((order:DriverOrder) => order.status == 'ongoing' || order.status == 'processing');

    processingOrder && this.getRequestDetails(processingOrder.id);
  }

  
  private getRequestDetails(requestId: number):void {
    const request$ = this.ordersProvider.getOrderDetails(requestId, this.userData.api_token);


    request$.subscribe(response => {
      if (response.success) {
        const currentProcessingdOrder: DriverOrder = response.data.order;
        this.goToDeliveryPage(currentProcessingdOrder);
      }
    })
  }

  private goToDeliveryPage(driverOrder: DriverOrder): void {
    this.navCtrl.push('UserPage', {user: driverOrder.order.user, orderId: driverOrder.id, orderStatus: driverOrder.status, driverOrder: driverOrder.order});
  } 

  private cancelRequest(orderId) {
    this.ordersProvider.refuseOrder(orderId, this.userData.api_token)
      .subscribe(response => {
        // console.log({response});
        if (response.success) {
          this.events.publish('updateOrders');
        }
      })
  }

  changeOrderStatus() {
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
    })

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
      const geolocate = this.geolocate.getCurrentPosition();

      geolocate.then((data: Geoposition) => {
        this.currentLocation = {lat:data.coords.latitude, long:data.coords.longitude};
        this.updateDelegateLocation();
      }).catch((err) => {
        this.checkLocation();
      })
    }

  private checkLocation() {
      this.diagnostic.isGpsLocationEnabled().then(e => {
        if (!e) {
          this.showAlert().then(state => {
            if (state == "ok") {
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
