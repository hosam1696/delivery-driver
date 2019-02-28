import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestsPage } from './requests';
import { TranslateModule } from '@ngx-translate/core';
import { OrdersProvider } from '../../providers/orders/orders';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { UtilsProvider } from '../../providers/utils/utils';
import { AudioProvider } from '../../providers/audio/audio';

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
    UtilsProvider,
    AudioProvider
  ]
})
export class RequestsPageModule {}
