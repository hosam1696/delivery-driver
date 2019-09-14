import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { TranslateModule } from '@ngx-translate/core';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { AudioProvider } from '../../providers/audio/audio';
import { AuthProvider } from "../../providers/auth/auth";

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
    AudioProvider,
    AuthProvider,

  ]
})
export class ProfilePageModule {}
