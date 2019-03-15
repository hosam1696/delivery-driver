import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {FormsModule} from "@angular/forms";

import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FCM} from '@ionic-native/fcm';
import {Geolocation} from '@ionic-native/geolocation';

import { AuthProvider } from '../providers/auth/auth';
import { AppstorageProvider } from '../providers/appstorage/appstorage';
import { UtilsProvider } from '../providers/utils/utils';
import { FcmProvider } from '../providers/fcm/fcm';
import { ApiProvider } from '../providers/api/api';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import { OrdersProvider } from '../providers/orders/orders';
import { AudioProvider } from '../providers/audio/audio';
import { NativeAudio } from '@ionic-native/native-audio';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    AppstorageProvider,
    UtilsProvider,
    FcmProvider,
    NativeAudio,
    ApiProvider,
    OrdersProvider,
    FCM,
    AudioProvider,
    Geolocation,
    LaunchNavigator
  ]
})
export class AppModule {}
