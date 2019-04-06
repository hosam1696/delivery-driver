import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppstorageProvider } from '../../providers/appstorage/appstorage';
import { FcmProvider } from '../../providers/fcm/fcm';
import { AudioProvider } from '../../providers/audio/audio';
import { Network } from '@ionic-native/network';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  rememberCredentials;
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

  }
  
  ionViewDidLoad() {
    
    this.events.subscribe('change:splash:screen', val => this.showSplash = val);
    setTimeout(()=> {
      this.showSplash = false;
    }, 3000);

    this.audioProvider.activateBtnSound();
  }
  


  submitOnConnect() {
    let connectionType = this.network.type;

    console.log({connectionType});
   
    if (connectionType != 'none') {
      this.submitForm();
    } else {
      this.utils.showToast('تعذر الاتصال بالانترنت');
    }
  }

  submitForm() {
    const validateForm = this.utils.validateForm(this.loginForm);
    console.log(this.loginForm.value);
    if (validateForm) {

      const authLogin$ = this.AuthProvider.login(this.loginForm.value);
      this.processing = true;
      authLogin$.subscribe(response => {
        this.processing = false;
        if (response.success) {
          // this.utils.showToast(response.message);

          Promise.all([
            this.appStorage.setUserData({...response.data.user, current_password: this.loginForm.get('password').value}),
            this.appStorage.saveToken(response.data.user.api_token)
          ]).then(() => {
            this.events.publish('update:storage')
            this.navCtrl.setRoot('RequestsPage');
          })


        } else {
          this.utils.showTranslatedToast(response.message == 'translation.auth failed' ? 'User Name or Password are not Correct' : response.message)
        }

      }, err => {
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
      const fcmToken = await this.fcmProvider.getToken()

      if (fcmToken) {
        this.loginForm.get('player_id').setValue(fcmToken);
        this.appStorage.saveFcmToken(fcmToken);
      }
  }

  goTo(page: string) {
    this.navCtrl.push(page);
  }

}
