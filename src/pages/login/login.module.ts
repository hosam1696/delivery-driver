import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import {TranslateModule} from "@ngx-translate/core";
import {AuthProvider} from "../../providers/auth/auth";
import {UtilsProvider} from "../../providers/utils/utils";

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild()
  ],
  providers: [
    AuthProvider,
    UtilsProvider
  ]
})
export class LoginPageModule {}
