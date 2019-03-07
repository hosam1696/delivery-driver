import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WaitingordersPage } from './waitingorders';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersProvider } from '../../providers/orders/orders';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    WaitingordersPage,
  ],
  imports: [
    IonicPageModule.forChild(WaitingordersPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  providers: [
    OrdersProvider,
    AppstorageProvider,
    UtilsProvider
  ]
})
export class WaitingordersPageModule {}
