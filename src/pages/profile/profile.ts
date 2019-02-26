import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/types/app-types';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userData: UserData;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private appStorage: AppstorageProvider
     ) {
  }

  async ionViewDidLoad() {

    this.userData = await this.appStorage.getUserData();
  }

}
