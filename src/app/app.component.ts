import { Component, ViewChild } from '@angular/core';
import {Events, Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";
import {AppDirLang, DocumentDirection} from "../providers/types/app-types";
import {AppstorageProvider} from "../providers/appstorage/appstorage";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';
  defaultLang: string = 'ar';
  pages: Array<{title: string, component: any}>;

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

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.appStorage.getAppLang()
        .then(lang => this.setDefaultLang(lang || this.defaultLang));
    });
  }

  logout () {
    
  }

  public changeLang(): void {
      const lang = this.translate.currentLang === 'ar' ? 'en' : 'ar';
      this.events.publish('change:lang', lang)
  }

  private setDefaultLang(lang: 'en' | 'ar') {
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
