import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { AudioProvider } from '../../providers/audio/audio';

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
     private appStorage: AppstorageProvider
     ) {
  }

  async ionViewDidLoad() {

    this.userData = await this.appStorage.getUserData();
    this.audioProvider.preload('clicked', '../assets/sounds/cs.mp3');
  }

  onClick() {
    this.audioProvider.play('clicked');
  }

}
