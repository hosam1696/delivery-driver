import {Component, Input} from '@angular/core';
import {DriverOrder} from "../../providers/types/app-types";

@Component({
  selector: 'driver-request',
  templateUrl: 'request.html'
})
export class RequestComponent {

  @Input('request') request: DriverOrder;

  constructor() {
  }

}
