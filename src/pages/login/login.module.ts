import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import {TranslateModule} from "@ngx-translate/core";
import {AuthProvider} from "../../providers/auth/auth";
import {UtilsProvider} from "../../providers/utils/utils";
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { StarterPage } from '../starter/starter';
import { FcmProvider } from '../../providers/fcm/fcm';

@NgModule({
  declarations: [
    LoginPage,
    StarterPage
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild()
  ],
  providers: [
    AuthProvider,
    UtilsProvider,
    AppstorageProvider,
    FcmProvider
  ],
  exports: [
    StarterPage
  ]
})
export class LoginPageModule {}
