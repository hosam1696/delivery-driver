import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { cameraType } from '../types/app-types';

@Injectable()
export class AppcameraProvider {

  options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    allowEdit: true,
    targetWidth: 400,
    targetHeight: 400,
    sourceType: this.camera.PictureSourceType.CAMERA,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };

  constructor(private camera: Camera) {
  }

  async takePicture(type: cameraType) {
    this.options.sourceType = type;
    let img = await this.camera.getPicture(this.options);
    // return `data:image/jpeg;base64,${img}`;
    return img;
  }

}