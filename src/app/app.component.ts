import {Component, ViewChild, Inject} from '@angular/core';
import {Events, Nav, Platform } from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";
import {AppDirLang, DocumentDirection, UserData, Langs, EVENTS, APP_PAGE} from "../providers/types/app-types";
import {AppstorageProvider} from "../providers/appstorage/appstorage";
import {AudioProvider} from '../providers/audio/audio';
import {FcmProvider} from '../providers/fcm/fcm';
import {AuthProvider} from "../providers/auth/auth";
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'LoginPage';
  defaultLang: Langs = 'ar';
  pages: Array<APP_PAGE>;
  userData: UserData;
  firebasePlugin;
  fcmPlugin;

  constructor(@Inject('DOMAIN_URL') public domainUrl,
              public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              private fcm: FCM,
              private audioProvider: AudioProvider,
              public fcmProvider: FcmProvider,
              public appStorage: AppstorageProvider,
              private authProvider: AuthProvider,
              public translate: TranslateService) {

                this.firebasePlugin = (<any>window).FirebasePlugin;
                
                this.fcmPlugin = (<any>window).FCMPlugin;
    this.pages = [
      {title: 'بياناتى', component: 'ProfilePage', icon: 'man-user1.png'},
      {title: 'الطلبات', component: 'RequestsPage', icon: 'synchronization-arrows-couple1.png'},
      {title: 'الطلبات المؤجلة', component: 'WaitingordersPage', icon: 'sync.png', pageStatus: 'waiting'},
      {title: 'الطلبات المكتملة', component: 'WaitingordersPage', icon: 'synchronization-arrows-couple1.png', pageStatus: 'completed'},
      {title: 'الطلبات المرتجعة',component: 'WaitingordersPage',icon: 'synchronization-arrows-couple1.png',pageStatus: 'returned'},
      {title: 'الطلبات المحولة',component: 'WaitingordersPage',icon: 'synchronization-arrows-couple1.png',pageStatus: 'delayed'},
      {title: 'الطلبات المرفوضة',component: 'WaitingordersPage',icon: 'synchronization-arrows-couple1.png',pageStatus: 'canceled'},
    ];

    this.initializeApp();

    this.subscribeEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.backgroundColorByHexString('#443279');
      this.splashScreen.hide();
      this.setRootPage();
      this.audioProvider.activateBtnSound();
      // this.fcmProvider.handleNotifications();
      this.firebasePlugin.onMessageReceived((message) => {
        // alert(JSON.stringify(message))
        if (message.order_id) {
          // this.openNotificationPopup(message);
          this.events.publish(EVENTS.UPDATE_ORDERS);
        }
      })

      this.fcm.onNotification().subscribe(data => {
        // alert(JSON.stringify(data))
      });

    });
  }

  private setRootPage() {

    Promise.all([
      this.appStorage.getAppLang(),
      this.appStorage.getUserData(),
      this.appStorage.getSavedToken()
    ]).then(async (data: [Langs, UserData, string]) => {
      const [lang, userData] = data;
      this.setDefaultLang(lang || this.defaultLang);
      if (userData) {
        this.events.publish(EVENTS.UPDATE_STORAGE);
        this.events.publish(EVENTS.GET_WAITING_ORDERS);
        this.events.publish(EVENTS.UPDATE_ROOT, 'RequestsPage');
      } else {
        this.events.publish(EVENTS.UPDATE_ROOT, 'LoginPage');
      }
    })
  }

  logout() {
    this.authProvider.logout(this.userData.api_token)
      .subscribe(response => {
        if (response.success) {
          // Promise.all([
          //   this.appStorage.storage.remove(LOCAL_STORAGE.USERDATA),
          //   this.appStorage.storage.remove(LOCAL_STORAGE.API_TOKEN),
          //   this.appStorage.storage.remove(LOCAL_STORAGE.FCM_TOKEN),
          // ])
          this.appStorage.storage.clear()
            .then(() => {
              this.setDefaultLang(this.defaultLang);
              this.events.publish(EVENTS.UPDATE_ROOT, 'LoginPage');
              this.events.publish(EVENTS.UPDATE_SPLASH, false);
              this.nav.setRoot('LoginPage');
            })
        } else {
          this.handleUnAuthorizedUser(() => this.logout());
        }
      })
  }

  private subscribeEvents() {

    this.events.subscribe(EVENTS.UPDATE_ROOT, page => this.rootPage = page);

    this.events.subscribe(EVENTS.UPDATE_STORAGE, () => {
      this.appStorage.getUserData().then(userData => this.userData = userData)
    });

    this.events.subscribe(EVENTS.HANDLE_UNAUTHORIZATION, data => this.handleUnAuthorizedUser(data))

    this.events.subscribe(EVENTS.UPDATE_PAGE_COUNT,numbers => {
      for(let i = 2 ;i<numbers.length+2;i++) {
        this.pages[i]['pageCount'] = numbers[i-2]
      }

      console.log({pages: this.pages})
    })

    this.events.subscribe('update:allRequests:count', count => {
      this.pages[1].pageCount = count;
    });
    // Testing Notification Popup in Browser
    // setTimeout( () => {
    //   this.events.publish(EVENTS.NOTIFICATION_POPUP, {wasTapped: false, order_id: 624})
    // }, 3000)
  }

  fillImgSrc(src: string): string {
    return src.startsWith('/storage') ? this.domainUrl.concat(src) : src;
  }

  openPage(page) {
    // show only the menu button on the requests page & make other pages sub pages from it
    if (this.nav.getActive().id == 'RequestsPage' && page.component != 'RequestsPage')
      this.nav.push(page.component, {pageStatus: page.pageStatus});
  }

  openProfilePage() {
    const page = this.pages.find(page => page.component == 'ProfilePage');
    this.openPage(page);
  }

  private handleUnAuthorizedUser(successCb: (data: [UserData, string]) => any): void {
    // const authToken$ = this.authProvider.refreshToken(this.userData.api_token);
    //
    // authToken$.subscribe(response => {
    //   if (response.success) {
    //     this.userData = {...this.userData, api_token: response.data.new_token};
    //     Promise.all([
    //       this.appStorage.setUserData(this.userData),
    //       this.appStorage.saveToken(response.data.new_token)
    //     ]).then(successCb)
    //   }
    // })

    const authLogin$ = this.authProvider.login({
      userName: this.userData.userName,
      password: this.userData.current_password,
      player_id: this.userData.player_id
    });

    authLogin$.subscribe(response => {
      if (response.success) {
        const loggedUser = response.data.user;
        this.userData = {...this.userData, api_token: loggedUser.api_token};
        Promise.all([
          this.appStorage.setUserData(this.userData),
          this.appStorage.saveToken(loggedUser.api_token)
        ]).then(successCb)
      }
    })
  }

  private setDefaultLang(lang: Langs) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.platform.setDir(AppDirLang[lang] as DocumentDirection, true);
    this.appStorage.getAppLang()
      .then(lang => this.setDefaultLang(lang || this.defaultLang));
  }

}
