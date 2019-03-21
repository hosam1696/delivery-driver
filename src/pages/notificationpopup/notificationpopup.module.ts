import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationpopupPage } from './notificationpopup';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    NotificationpopupPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationpopupPage),
    ClickOutsideModule
  ],
})
export class NotificationpopupPageModule {}
