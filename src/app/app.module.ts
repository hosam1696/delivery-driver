import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {FormsModule} from "@angular/forms";

import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {FCM} from '@ionic-native/fcm';
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
import { Network } from '@ionic-native/network';
import {Diagnostic} from "@ionic-native/diagnostic";
import {Geolocation} from "@ionic-native/geolocation";
import { CallNumber } from '@ionic-native/call-number';
import { AppcameraProvider } from '../providers/appcamera/appcamera';
import { Camera } from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';
import { BackgroundMode } from "@ionic-native/background-mode";
import { NotificationsProvider } from '../providers/notifications/notifications';

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
    {provide: 'DOMAIN_URL', useValue: 'https://moovstore.com'},
    AuthProvider,
    AppstorageProvider,
    UtilsProvider,
    FcmProvider,
    NativeAudio,
    ApiProvider,
    OrdersProvider,
    FCM,
    AudioProvider,
    LaunchNavigator,
    FcmProvider,
    Network,
    Geolocation,
    Diagnostic,
    CallNumber,
    AppcameraProvider,
    Camera,
    Firebase,
    BackgroundMode,
    NotificationsProvider
  ]
})
export class AppModule {}
