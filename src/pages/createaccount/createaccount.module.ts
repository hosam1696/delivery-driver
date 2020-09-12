import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateaccountPage } from './createaccount';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CreateaccountPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateaccountPage),
    TranslateModule.forChild()
  ],
})
export class CreateaccountPageModule {}
