import {Injectable} from '@angular/core';
import {
  ToastController,
  ToastOptions,
  ActionSheetController
} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup} from "@angular/forms";


@Injectable()
export class UtilsProvider {

  constructor(
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private actionCtrl: ActionSheetController
  ) {
  }

  showToast(message: string, settings?: ToastOptions, callback?: any) {
    let toast = this.toastCtrl.create({
      message, ...{
        duration: 3000,
        position: 'bottom',
        cssClass: 'toast-sm'
      }, ...settings
    });
    toast.onDidDismiss(callback);
    toast.present();
  }

  showTranslatedToast(message, settings?: ToastOptions) {
    this.showToast(this.translate.instant(message), settings);
  }

  validateForm(form: FormGroup) {
    const formFields = Object.keys(form.value);
    const translatedFields = formFields.map(fieldName => this.translate.instant(fieldName));
    // console.log('form fields', formFields, translatedFields);
    return formFields.every((formField, index) => {
      if (form.get(formField).getError('required')) {
        this.showToast(`${this.translate.instant('you have to enter')} ${translatedFields[index]}`);
        return false;
      } else if (form.get(formField).getError('unconfirmedpass')) {
        this.showTranslatedToast('passwords must be identical')
      } else if (form.get(formField).getError('minlength')) {
        this.showToast(`${translatedFields[index]} ${this.translate.instant('must be')} ${form.get(formField).getError('minlength').requiredLength} ${this.translate.instant('letters at least')}`);
        return false;
      } else if (form.get(formField).getError('pattern')) {
        this.showToast(`${this.translate.instant('you have to insert right value to')} ${translatedFields[index]}`);
        return false;
      } else {
        return true;
      }
    });
  }


  openImageAlert(cameraHandler, photoAlbumHandler): Promise<any> {
    let actionSheetCtrl = this.actionCtrl.create({
      title: this.translate.instant('رفع الصورة عن طريق'),
      buttons: [
        {
          icon: 'camera',
          text: this.translate.instant('الكاميرا'),
          handler: cameraHandler
        },
        {
          icon: 'images',
          text: this.translate.instant('معرض الصور'),
          handler: photoAlbumHandler
        },
        {
          text: this.translate.instant('الغاء'),
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    return actionSheetCtrl.present();
  }

  formatPhoneNumber(phoneNumber: string) {

    let number = phoneNumber;
    if (number[0] == '0') {
      number = number.substr(1);
    }
    if (/^\966/.test(number)) {
      number = '+' + number;
    }
    if (!/^\+966/.test(number) && !/^\+/.test(number)) {
      number = '+966' + number
    }
    return number
  }

}
