import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CheckPhase } from '../../providers/types/app-types';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilsProvider } from '../../providers/utils/utils';


@IonicPage()
@Component({
  selector: 'page-forgetpassword',
  templateUrl: 'forgetpassword.html',
})
export class ForgetpasswordPage {
  forgetForm: FormGroup;
  processing = false;
  checkPhase: CheckPhase = 'mobilePhone';
  apiKey;

  constructor(public navCtrl: NavController,
    public authProvider: AuthProvider,
    private formBuilder: FormBuilder,
    private utils: UtilsProvider,
    public navParams: NavParams) {
    this.buildForm();
  }

  ionViewDidLoad() {
  }


  onSubmit() {

    const formValue = this.forgetForm.value;

    if (this.checkPhase == 'mobilePhone') {
      const phoneValue = formValue.phone;

      console.log(phoneValue)
      if (phoneValue) {
        this.processing = true;

        const checkPhone$ = this.authProvider.checkPhoneNumber(phoneValue)

        checkPhone$.subscribe(res => {
          console.log(res)
          if (res.success) {
            this.checkPhase = 'verifyCode';

            if (res.message) {
              this.utils.showToast(res.message)
            }

          } else {
            this.utils.showToast(res.error)
          }

        }, err => {

        }, () => {
          this.processing = false
        })
      }
    } else if (this.checkPhase === 'verifyCode') {
      if (formValue.code) {
        this.processing = true;

        const verify$ = this.authProvider.verifyCode(formValue.phone, formValue.code)

        verify$.subscribe(res => {
          console.log(res)
          if (res.success) {
            this.checkPhase = 'changePassword';
            if (res.data && res.data.driver) {
              this.apiKey = res.data.driver.api_key
            }

            if (res.message) {
              this.utils.showToast(res.message)
            }
          } else {
            this.utils.showToast(res.message)
          }

        }, err => {

        }, () => {
          this.processing = false
        })
      }
    } else {
      if (this.checkPhase == 'changePassword') {
        this.processing = true;

        const updatePassword$ = this.authProvider.updatePassword(this.apiKey, formValue.password, formValue.confirm_password)
        updatePassword$.subscribe((res) => {
          if (res.success) {
            if (res.message) {
              this.utils.showToast(res.message);
            }
            this.navCtrl.pop();
          } else {
            this.utils.showToast('يرجى التأكد من تطابق كلمات المرور')
          }
        }, err => {

        }, () => {
          this.processing = false;
        })
      }
    }
  }

  private buildForm() {
    this.forgetForm = this.formBuilder.group({
      phone: [''],
      code: [''],
      password: [''],
      confirm_password: ['']
    });
  }
}
