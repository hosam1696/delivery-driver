import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  AlertOptions
} from "ionic-angular";
import { User } from "../../providers/types/app-types";

import {
  LaunchNavigator,
  LaunchNavigatorOptions
} from "@ionic-native/launch-navigator";
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import { Diagnostic } from "@ionic-native/diagnostic";

declare let google;

@IonicPage()
@Component({
  selector: "page-map",
  templateUrl: "map.html"
})
export class MapPage {
  @ViewChild("map") mapElement: ElementRef;
  myLatLng: [number, number];
  user: User;
  map;
  currentLocation;

  constructor(
    public navCtrl: NavController,
    private launchNavigator: LaunchNavigator,
    private geolocate: Geolocation,
    private alertCtrl: AlertController,
    public diagnostic: Diagnostic,
    public navParams: NavParams
  ) {
    this.user = this.navParams.get("user");
  }

  ionViewDidLoad() {
    this.initMap([this.user.lat, this.user.long]);
    this.getCurrentLoaction();
    this.checkLocation();
  }

  private checkLocation() {
    this.diagnostic.isGpsLocationEnabled().then(e => {
      if (!e) {
        this.showAlert().then(stat => {
          if (stat == "ok") {
            this.diagnostic.switchToLocationSettings();
          }
        });
      }
    });
  }

  showAlert() {
    return new Promise((resolve, reject) => {
      const options: AlertOptions = {
        title: "الموقع",
        subTitle: " للاستمرار يرجى تفعيل GPS",
        buttons: [
          {
            text: "لا شكرا",
            role: "cancel",
            handler: () => {
              resolve("cancel");
            }
          },
          {
            text: "موافق",
            handler: () => {
              resolve("ok");
            }
          }
        ]
      };

      const alert = this.alertCtrl.create(options);

      alert.present();
    });
  }

  initMap(latlng) {
    let latLng = new google.maps.LatLng(Number(latlng[0]), Number(latlng[1]));
    let mapOptions = {
      center: latLng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      disableDefaultUI: true
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

    marker.addListener("click", event => {
      console.log(event);
    });
  }

  getCurrentLoaction() {
    const geolocate = this.geolocate.getCurrentPosition();

    geolocate.then((data: Geoposition) => {
      this.currentLocation = [data.coords.latitude, data.coords.longitude];
    });
  }

  showOnMaps() {
    let options: LaunchNavigatorOptions = {
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };
    this.launchNavigator.navigate([+this.user.lat, +this.user.long], options);
  }
}
