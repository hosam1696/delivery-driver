import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import {DriverOrder, OrderStatus, UserData} from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';
import { AudioProvider } from '../../providers/audio/audio';
import { AuthProvider } from '../../providers/auth/auth';
import { Network } from '@ionic-native/network';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public appStorageProvider: AppstorageProvider,
              private ordersProvider: OrdersProvider,
              private authProvider: AuthProvider,
              private utils: UtilsProvider,
              private popOverCtrl: PopoverController,
              private network: Network,
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
    
  }


  async ionViewDidLoad() {
    this.userData = await this.appStorageProvider.getUserData();

    this.checkConnection();

    this.getAllOrders();

    this.audioProvider.activateBtnSound();

    this.events.subscribe('updateOrders', () => {
      
      this.getAllOrders();
    });

    this.events.subscribe('update:storage', () => {
      this.appStorageProvider.getUserData()
        .then(userData => this.userData = userData)
    });

  }



  private checkConnection() {
    let connectionType = this.network.type;

    this.disconnect$ = this.network.onDisconnect()
      .subscribe(()=> {
        this.utils.showToast('تعذر الاتصال بالانترنت');
      })

    this.connect$ = this.network.onDisconnect()
      .subscribe(()=> {

        setTimeout(() => {
          let connectionType = this.network.type;
          this.getAllOrders();
          // console.log({connectionType});
        }, 3000);
      })
  }

  ionViewWillLeave() {
    this.disconnect$.unsubscribe();
    this.connect$.unsubscribe();

  }

  private getAllOrders() {

    const orders$ = this.ordersProvider.getAllOrders(this.userData.api_token);

    orders$.subscribe(response => {
      // console.log({ordersResponse: response});
      if (response.success) {
        this.allRequests = this.requests = this.checkDelayedOrders(response.data.orders);
      } else if (response.error == 'Unauthenticated' || response.error == 'Unauthenticated.') {
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
    }, err => {
      console.warn(err);
    })
  }

  onToggleChange(event) {
    console.log(event.value);
    this.isReceivingRequests = event.value;
    this.changeOrderStatus();
  }

  private checkDelayedOrders(orders) {
    let allOrders, supposedTime = 1000 * 60 * 10 , dateNow = +Date.now(),
     isExceededTime = order => dateNow - +new Date(order.created_at) > supposedTime;

    allOrders = orders.filter(order => order.status != 'init');
    // allOrders = orders;
    // Change the status of exceeded delayed order
    orders.filter(order => isExceededTime(order) && order.status == 'init').forEach(order => {
      this.cancelRequest(order.id)
      // console.log({order})
    });

    return allOrders;
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
}
