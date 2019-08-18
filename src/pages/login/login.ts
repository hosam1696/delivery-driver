import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { FcmProvider } from '../../providers/fcm/fcm';
import { AudioProvider } from '../../providers/audio/audio';
import { Network } from '@ionic-native/network';
import { EVENTS } from '../../providers/types/app-types';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private _splashScreenDuration: number = 3;
  loginForm: FormGroup;
  processing: boolean = false;
  showSplash: boolean = true;

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private AuthProvider: AuthProvider,
    private events: Events,
    private appStorage: AppstorageProvider,
    private utils: UtilsProvider,
    private fcmProvider: FcmProvider,
    private network: Network,
    private audioProvider: AudioProvider,
    public navParams: NavParams) {
    this.buildForm();

    this.events.subscribe(EVENTS.UPDATE_SPLASH, val => this.showSplash = val);
  }

  ionViewDidLoad() {

    this.audioProvider.activateBtnSound();

    setTimeout(()=> {
      this.showSplash = false;
    }, this._splashScreenDuration * 1000);
  }


  submitOnConnect() {
    let connectionType = this.network.type;

    if (connectionType != 'none') {
      this.submitForm();
    } else {
      this.utils.showToast('تعذر الاتصال بالانترنت');
    }
  }

  submitForm() {
    const isValidForm = this.utils.validateForm(this.loginForm);

    if (isValidForm) {
      const authLogin$ = this.AuthProvider.login(this.loginForm.value);
      this.processing = true;
      authLogin$.subscribe(response => {
        this.processing = false;
        if (response.success) {
          const loggedUser = response.data.user,
                isRestaurantDelegate = loggedUser.logistic_company_service.service && loggedUser.logistic_company_service.service.name == 'توصيل مطاعم';

          Promise.all([
            this.appStorage.setUserData({...loggedUser, current_password: this.loginForm.get('password').value, isRestaurantDelegate, deliveryCost: response.data.deliveryCost}),
            this.appStorage.saveToken(loggedUser.api_token)
          ]).then(() => {
            this.events.publish(EVENTS.UPDATE_STORAGE);
            this.navCtrl.setRoot('RequestsPage');
            this.fcmProvider.handleNotifications();
          })

        } else {
          this.utils.showTranslatedToast(response.message == 'translation.auth failed' ? 'User Name or Password are not Correct' : response.message)
        }

      }, () => {
        this.utils.showToast('Some thing not Correct, Please try again later');
        this.processing = false;
      })
    }
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      player_id: ['']
    });

    this.setToken();
  }

  async setToken() {
      // if The driver logged in from device then send the device token to login params
      const fcmToken = await this.fcmProvider.getToken();

      if (fcmToken) {
        this.loginForm.get('player_id').setValue(fcmToken);
        this.appStorage.saveFcmToken(fcmToken);
      }
  }


}
