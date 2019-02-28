import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { TranslateModule } from '@ngx-translate/core';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { AudioProvider } from '../../providers/audio/audio';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    TranslateModule
  ],
  providers: [
    AppstorageProvider,
    AudioProvider
  ]
})
export class ProfilePageModule {}
