import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserPage } from './user';
import {TranslateModule} from "@ngx-translate/core";
import { OrdersProvider } from '../../providers/orders/orders';

@NgModule({
  declarations: [
    UserPage,
  ],
  imports: [
    IonicPageModule.forChild(UserPage),
    TranslateModule.forChild()
  ],
  providers: [
    OrdersProvider
  ]
})
export class UserPageModule {}
