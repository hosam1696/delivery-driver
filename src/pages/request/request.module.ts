import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestPage } from './request';
import {OrdersProvider} from "../../providers/orders/orders";
import {AppstorageProvider} from "../../providers/appstorage/appstorage";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    RequestPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestPage),
    TranslateModule.forChild()
  ],
  providers: [
    OrdersProvider,
    AppstorageProvider
  ]
})
export class RequestPageModule {}
