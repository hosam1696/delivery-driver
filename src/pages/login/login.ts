import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../providers/auth/auth";
import {UtilsProvider} from "../../providers/utils/utils";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              private AuthProvider: AuthProvider,
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

      authLogin$.subscribe(response => {
        this.utils.showToast(response.message);
        if (response.success) {
          console.log('Login Success with', response);
        }
      })
    }
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  goTo(page: string) {
    this.navCtrl.push(page);
  }

}
