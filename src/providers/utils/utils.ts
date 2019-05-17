import {Injectable} from '@angular/core';
import {
  ToastController,
  ToastOptions
} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup} from "@angular/forms";


@Injectable()
export class UtilsProvider {

  constructor(
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {
  }

  showToast(message: string, settings?: ToastOptions, callback?: any) {
    let toast = this.toastCtrl.create({
      message, ...{
        duration: 3000,
        position: 'top',
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

}
