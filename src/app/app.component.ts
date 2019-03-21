import { Component, ViewChild } from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";
import {AppDirLang, DocumentDirection, UserData, Langs} from "../providers/types/app-types";
import {AppstorageProvider} from "../providers/appstorage/appstorage";
import { AudioProvider } from '../providers/audio/audio';
import { FcmProvider } from '../providers/fcm/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  defaultLang: Langs = 'ar';
  pages: Array<{title: string, component: any, icon: string}>;
  userData: UserData;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              private audioProvider: AudioProvider,
              public fcmProvider: FcmProvider,
              public appStorage:AppstorageProvider,
              public translate: TranslateService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'بياناتى', component: 'ProfilePage', icon: 'man-user1.png' },
      { title: 'الطلبات', component: 'RequestsPage', icon: 'synchronization-arrows-couple1.png' },
      { title: 'الطلبات المؤجلة', component: 'WaitingordersPage', icon: 'sync.png' }
    ];

    this.subscribeEvents();

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.backgroundColorByHexString('#443279');
      this.splashScreen.hide();

      this.setRootPage();
     
      this.audioProvider.activateBtnSound();

    });
  }

  private setRootPage() {

    Promise.all([
      this.appStorage.getAppLang(),
      this.appStorage.getUserData()
    ]).then( async (data: [Langs, UserData])=> {
      const [lang, userData] = data;
      this.setDefaultLang(lang || this.defaultLang);
      if (userData) {
        this.events.publish('update:storage');
        this.rootPage = 'RequestsPage';
      } else {
        this.rootPage = 'LoginPage'  
      }
    })
  }

  logout () {
      Promise.all([
        this.appStorage.storage.remove('delivery:user:data'),
        this.appStorage.storage.remove('delivery:api:token'),
        this.appStorage.storage.remove('delivery:fcm:token'),
      ]).then(()=>{
        this.rootPage = 'LoginPage';
        this.nav.setRoot('LoginPage')
        this.events.publish('change:splash:screen', false);
      })
  }

  private subscribeEvents() {
    this.events.subscribe('change:root', page => this.rootPage = page);
    this.events.subscribe('update:storage', () => {
      this.appStorage.getUserData()
        .then(userData => this.userData = userData)
    });

    setTimeout( () => {
      this.events.publish('open:popup')

    }, 3000)

  }

  public changeLang(): void {
      const lang = this.translate.currentLang === 'ar' ? 'en' : 'ar';
      this.events.publish('change:lang', lang)
  }

  private setDefaultLang(lang: Langs) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.platform.setDir(AppDirLang[lang] as DocumentDirection, true);
    // this.config.set('backButtonIcon',lang == 'en'? 'arrow-back':'arrow-forward');
    this.appStorage.getAppLang()
      .then(lang => this.setDefaultLang(lang || this.defaultLang));

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  openProfilePage() {
    const page = this.pages.find(page => page.component == 'ProfilePage');

    this.openPage(page);
  }
}
