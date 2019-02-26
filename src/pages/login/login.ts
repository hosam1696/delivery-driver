import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthProvider } from "../../providers/auth/auth";
import { UtilsProvider } from "../../providers/utils/utils";
import { AppstorageProvider } from '../../providers/appstorage/appstorage';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  rememberCredentials;
  processing: boolean = false;

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private AuthProvider: AuthProvider,
    private events: Events,
    private appStorage: AppstorageProvider,
    private utils: UtilsProvider,
    public navParams: NavParams) {
    this.buildForm();
  }

  ionViewDidLoad() {
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

          this.utils.showToast(response.message);

          Promise.all([
            this.appStorage.setUserData(response.data.user),
            this.appStorage.saveToken(response.data.user.api_token)
          ]).then(() => {
            this.events.publish('update:storage')
          })

          this.goTo('ProfilePage');

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
  }

  goTo(page: string) {
    this.navCtrl.push(page);
  }

}
