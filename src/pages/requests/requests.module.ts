import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestsPage } from './requests';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersProvider } from '../../providers/orders/orders';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';

@NgModule({
  declarations: [
    RequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestsPage),
    TranslateModule.forChild()
  ],
  providers: [
    OrdersProvider,
    AppstorageProvider,
    UtilsProvider
  ]
})
export class RequestsPageModule {}
