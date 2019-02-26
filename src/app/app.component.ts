import { Component, ViewChild } from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";
import {AppDirLang, DocumentDirection, UserData, Langs} from "../providers/types/app-types";
import {AppstorageProvider} from "../providers/appstorage/appstorage";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'StarterPage';
  defaultLang: Langs = 'ar';
  pages: Array<{title: string, component: any}>;
  userData: UserData;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public events: Events,
              public appStorage:AppstorageProvider,
              public translate: TranslateService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'بياناتى', component: 'HomePage' },
      { title: 'الطلبات', component: 'ListPage' },
      { title: ' الطلبات المؤجلة', component: 'ListPage' }
    ];

    this.subscribeEvents();

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.setRootPage();

    });
  }

  private setRootPage() {

    Promise.all([
      this.appStorage.getAppLang(),
      this.appStorage.getUserData()
    ]).then( async (data: [Langs, UserData])=> {
      const [lang, userData] = data;
      this.setDefaultLang(lang || this.defaultLang);
      this.rootPage = userData ? 'ProfilePage' : 'LoginPage'
    })
  }

  logout () {
      Promise.all([
        this.appStorage.storage.remove('delivery:user:data'),
        this.appStorage.storage.remove('delivery:token'),
      ]).then(()=>{
        this.rootPage = 'LoginPage';
        this.nav.setRoot('LoginPage')
      })
  }

  private subscribeEvents() {
    this.events.subscribe('change:root', page => this.rootPage = page);
    this.events.subscribe('update:storage', () => {
      this.appStorage.getUserData()
        .then(userData => this.userData = userData)
    });

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
    this.nav.setRoot(page.component);
  }
}
