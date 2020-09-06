import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Sound} from '../types/app-types';

@Injectable()
export class AudioProvider {

  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;

  constructor(private platform: Platform, private nativeAudio: NativeAudio){

  }

  preload(key: string, asset: string): void {

    if((this.platform.is('cordova') || this.platform.is('android')) && !this.forceWebAudio){

      this.nativeAudio.preloadSimple(key, asset);

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });

    } else {

      let audio = new Audio();
      audio.src = asset;

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });

    }

  }

  play(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(soundToPlay.isNative){

      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {

      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();

    }

  }

  stop() {

    this.sounds.forEach(sound => {
      if(sound.isNative){

        this.nativeAudio.stop(sound.asset).then((res) => {
          console.log(res);
        }, (err) => {
          console.log(err);
        });
  
      } else {
  
        this.audioPlayer.pause();
  
      }
    })
  }
  
  activateBtnSound() {
    this.preload('btnClick', '../assets/sounds/cs.mp3');

    Array.from(document.getElementsByTagName('button')).forEach(btn => {
      btn.onclick =  () => {
        this.play('btnClick');
      }
    })
  }

  activateNotifySound() {
    this.preload('notifySound', '../assets/sounds/notify-sound.mp3');

    this.play('notifySound');
  }

}
