import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { AudioProvider } from '../../providers/audio/audio';
import { AuthProvider } from "../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userData: UserData;

  constructor(
     @Inject('DOMAIN_URL') public domainUrl,
     public navCtrl: NavController,
     public navParams: NavParams,
     private audioProvider: AudioProvider,
     private appStorage: AppstorageProvider,
     private authProvider: AuthProvider,
     ) {
  }

  async ionViewDidLoad() {

    this.userData = await this.appStorage.getUserData();
    this.audioProvider.preload('clicked', '../assets/sounds/cs.mp3');
    this.updateUserData();
  }

  private updateUserData(): void {
    const authLogin$ = this.authProvider.login({
      userName: this.userData.userName,
      password: this.userData.current_password,
      player_id: this.userData.player_id
    });

    authLogin$.subscribe(response => {
      if (response.success) {
        const loggedUser = response.data.user;
        this.userData = {...this.userData, api_token: loggedUser.api_token};
        Promise.all([
          this.appStorage.setUserData(this.userData),
          this.appStorage.saveToken(loggedUser.api_token)
        ]).then()
      }
    })
  }

  onClick() {
    this.audioProvider.play('clicked');
  }

  fillImgSrc(src: string): string {

    return src.startsWith('/storage')?this.domainUrl.concat(src):src;
  }
}
