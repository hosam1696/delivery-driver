import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgetpasswordPage } from './forgetpassword';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ForgetpasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgetpasswordPage),
    TranslateModule.forChild()
  ],
})
export class ForgetpasswordPageModule {}
