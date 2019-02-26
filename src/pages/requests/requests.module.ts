import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestsPage } from './requests';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestsPage),
    TranslateModule.forChild()
  ],
})
export class RequestsPageModule {}
