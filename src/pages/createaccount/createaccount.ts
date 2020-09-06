import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { UtilsProvider } from '../../providers/utils/utils';
import { cameraType, UploadedPhoto } from '../../providers/types/app-types';
import { AppcameraProvider } from '../../providers/appcamera/appcamera';
import { AuthProvider } from '../../providers/auth/auth';
import { FcmProvider } from '../../providers/fcm/fcm';
import { AppstorageProvider } from '../../providers/appstorage/appstorage';


@IonicPage()
@Component({
  selector: 'page-createaccount',
  templateUrl: 'createaccount.html',
})
export class CreateaccountPage {
  errorMessages;
  createAccountForm: FormGroup;
  processing: boolean = false;
  uploadedPhotoType: UploadedPhoto;
  services;
  imgName: string;
  isSelectedAvatar: boolean = false;
  areas;
  cities;

  constructor(public navCtrl: NavController,
      private formBuilder: FormBuilder,
      private utils: UtilsProvider,
      private auth: AuthProvider,
      private fcmProvider: FcmProvider,
      private loadingCtrl: LoadingController,
      private appStorage: AppstorageProvider,
      private cameraProvider: AppcameraProvider,
      public navParams: NavParams) {
      this.buildForm();
    }

  ionViewDidLoad() {

    this.auth.getServices()
      .subscribe(response => {
        if (response.success) {
          this.services = response.data.services;
          console.log(this.services);
        }
      });
      this.auth.getAreas()
      .subscribe(response => {
        console.log({response})
        if (response.success) {
          this.areas = response.data.filter;
          console.log(this.areas);
        }
      });

      this.createAccountForm.get('state_id').valueChanges.subscribe(stateId => {
        this.getCities(stateId)
      })
  }


  getCities(stateId) {
    this.auth.getCities(stateId)
      .subscribe(response => {
        console.log({response})
        if (response.success) {
          this.cities = response.data.filter;
          console.log(this.cities);
        }
      })
  }

  insurePass(input:FormControl ):{ [s: string]: boolean } {
    if (!input.root || !input.root.value) {
      return null;
    }
    const exactMatch = input.root.value.password === input.value;

    return exactMatch ? null: {unconfirmedpass: true};
  }

  submitForm() {
    this.errorMessages = null;

    console.log({form: this.createAccountForm})
    const isValid = this.utils.validateForm(this.createAccountForm);

    if (isValid) {
      const loader = this.loadingCtrl.create()
      loader.present();
      this.createAccountForm.get('phoneNumber').setValue(this.utils.formatPhoneNumber(this.createAccountForm.value.phoneNumber));
      let accountData = this.createAccountForm.value;

      this.auth.createAccount(accountData)
        .subscribe(response => {
          loader.dismiss();
          if (response.success) {
            this.utils.showToast(response.message);
            this.processing = false;

            this.navCtrl.pop();
            // const authLogin$ = this.auth.login({userName: accountData.userName, password: accountData.password, player_id: accountData.player_id});
            // authLogin$.subscribe(response => {
            //   if (response.success) {
            //     const loggedUser = response.data.user,
            //           isRestaurantDelegate = loggedUser.logistic_company_service.service && loggedUser.logistic_company_service.service.name == 'توصيل مطاعم';
      
            //     Promise.all([
            //       this.appStorage.setUserData({...loggedUser, current_password: this.createAccountForm.get('password').value, isRestaurantDelegate, deliveryCost: response.data.deliveryCost}),
            //       this.appStorage.saveToken(loggedUser.api_token)
            //     ]).then(() => {
            //       this.events.publish(EVENTS.UPDATE_STORAGE);
            //       this.navCtrl.setRoot('RequestsPage');
            //     })
      
            //   } else {
            //     this.utils.showTranslatedToast(response.message == 'translation.auth failed' ? 'User Name or Password are not Correct' : response.message)
            //   }
            // })
            
          } else {
            if (response.errors) {
              let errors = response.errors;
              this.errorMessages = Object.keys(errors).map(e => errors[e][0]);
            } else if (response.error){
              this.utils.showToast(response.error.message)
            } else {
              this.utils.showToast('حدث خطأ يرجى المحاولة مرةأخرى')
            }
          }
          // console.log(response);
        }, err => {
          loader.dismiss();
          this.utils.showToast(err.message);
        })
    }

    
  }

  openImageAlert(photo: UploadedPhoto) {
    this.uploadedPhotoType = photo;
    this.utils.openImageAlert(
      this.takeImageBy(cameraType.CAMERA),
      this.takeImageBy(cameraType.PHOTOLIBRARY)
    );
  }

  imageChange(event, photoType: UploadedPhoto) {
    const imageFile = event.target.files[0];
    console.log(imageFile);
    if (photoType == 'photo') {
      const loadFile = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
          var output = document.getElementById('img-preview') as any;
          output.src = reader.result;
          this.isSelectedAvatar = true;
        };
        reader.readAsDataURL(imageFile);
      };

      loadFile(event)
    } else {
      this.imgName = imageFile.name
    }
    this.createAccountForm.get(photoType).setValue(imageFile);
  }

  private takeImageBy(type: cameraType) {
    return async () => {
      console.log({openCameraAs: [type, cameraType[type]]});
      const imgFile = await this.cameraProvider.takePicture(type);

      alert(imgFile);
      this.createAccountForm.get(this.uploadedPhotoType).setValue(imgFile);
      // UPLOUD Image file
    };
  }

  private buildForm() {
    this.createAccountForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', Validators.required],
      service: ['', Validators.required],
      password: ['',[Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', this.insurePass],
      photo: ['', Validators.required],
      identity_image: ['', Validators.required],
      player_id: [''],
      city_id: [''],
      state_id: ['']
    });
    
    this.setToken();
  }


  async setToken() {
    // if The driver logged in from device then send the device token to login params
    const fcmToken = await this.fcmProvider.getToken();

    if (fcmToken) {
      this.createAccountForm.get('player_id').setValue(fcmToken);
      this.appStorage.saveFcmToken(fcmToken);
    }
}

}
