import {Component, ViewChild, Inject} from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";
import {AppDirLang, DocumentDirection, UserData, Langs} from "../providers/types/app-types";
import {AppstorageProvider} from "../providers/appstorage/appstorage";
import {AudioProvider} from '../providers/audio/audio';
import {FcmProvider} from '../providers/fcm/fcm';
import {AuthProvider} from "../providers/auth/auth";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  defaultLang: Langs = 'ar';
  pages: Array<{ title: string, component: any, icon: string, pageStatus?: string }>;
  userData: UserData;

  constructor(@Inject('DOMAIN_URL') public domainUrl,
              public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              private audioProvider: AudioProvider,
              public fcmProvider: FcmProvider,
              public appStorage: AppstorageProvider,
              private authProvider: AuthProvider,
              public translate: TranslateService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'بياناتى', component: 'ProfilePage', icon: 'man-user1.png'},
      {title: 'الطلبات', component: 'RequestsPage', icon: 'synchronization-arrows-couple1.png'},
      {title: 'الطلبات المؤجلة', component: 'WaitingordersPage', icon: 'sync.png', pageStatus: 'waiting'},
      {
        title: 'الطلبات المكتملة',
        component: 'WaitingordersPage',
        icon: 'synchronization-arrows-couple1.png',
        pageStatus: 'completed'
      },
      {
        title: 'الطلبات المرتجعة',
        component: 'WaitingordersPage',
        icon: 'synchronization-arrows-couple1.png',
        pageStatus: 'returned'
      },
      {
        title: 'الطلبات المرفوضة',
        component: 'WaitingordersPage',
        icon: 'synchronization-arrows-couple1.png',
        pageStatus: 'canceled'
      }
    ];

    this.subscribeEvents();

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.backgroundColorByHexString('#443279');
      this.splashScreen.hide();

      this.setRootPage();

      this.audioProvider.activateBtnSound();

      this.fcmProvider.handleNotifications();

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
        this.events.publish('update:storage');
        this.events.publish('getWaitingOrders')
        this.rootPage = 'RequestsPage';
      } else {
        this.rootPage = 'LoginPage'
      }
    })
  }

  logout() {

    this.authProvider.logout(this.userData.api_token)
      .subscribe(response => {
        if (response.success) {

        Promise.all([
          this.appStorage.storage.remove('delivery:user:data'),
          this.appStorage.storage.remove('delivery:api:token'),
          this.appStorage.storage.remove('delivery:fcm:token'),
        ]).then(() => {
          this.rootPage = 'LoginPage';
          this.nav.setRoot('LoginPage')
          this.events.publish('change:splash:screen', false);
        })
        } else {
          //TODO: Check error or network connection
        }
      })
  }

  private subscribeEvents() {
    this.events.subscribe('change:root', page => this.rootPage = page);
    this.events.subscribe('update:storage', () => {
      this.appStorage.getUserData()
        .then(userData => this.userData = userData)
    });

    //Testing Notification Popup in Browser
    // setTimeout( () => {
    //   this.events.publish('open:popup', {wasTapped: false, order_id: 139})
    // }, 3000)

  }

  //TODO: To use later if we added second lang to the app

  private setDefaultLang(lang: Langs) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.platform.setDir(AppDirLang[lang] as DocumentDirection, true);
    this.appStorage.getAppLang()
      .then(lang => this.setDefaultLang(lang || this.defaultLang));

  }


  fillImgSrc(src: string): string {

    return src.startsWith('/storage') ? this.domainUrl.concat(src) : src;
  }

  openPage(page) {

    // show only the menu button on the requests page & make other pages subpages from it
    if (this.nav.getActive().id == 'RequestsPage' && page.component != 'RequestsPage')
      this.nav.push(page.component, {pageStatus: page.pageStatus});
  }

  openProfilePage() {
    const page = this.pages.find(page => page.component == 'ProfilePage');

    this.openPage(page);
  }
}
