import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers/types/app-types";



declare let google;


@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  myLatLng: [number, number];
  user: User;
  map;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.user = this.navParams.get('user');

  }

  ionViewDidLoad() {
    this.initMap([this.user.lat, this.user.long]);
  }


  initMap(latlng) {
    let latLng = new google.maps.LatLng(Number(latlng[0]), Number(latlng[1]));
    let mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      disableDefaultUI: true,

    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(latlng);

  }


  addMarker(loc, teacher?: any) {
    // console.log('creating marker on loc', loc, teacher);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(Number(loc[0]), Number(loc[1]))
    });

    marker.addListener('click', (event) => {
      console.log(event);

    })
  }


}
