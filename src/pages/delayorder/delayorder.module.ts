import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelayorderPage } from './delayorder';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    DelayorderPage,
  ],
  imports: [
    IonicPageModule.forChild(DelayorderPage),
    ClickOutsideModule
  ],
})
export class DelayorderPageModule {}
