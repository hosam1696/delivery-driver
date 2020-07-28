import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RefusemsgPage } from './refusemsg';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    RefusemsgPage,
  ],
  imports: [
    IonicPageModule.forChild(RefusemsgPage),
    ClickOutsideModule
  ],
})
export class RefusemsgPageModule {}
