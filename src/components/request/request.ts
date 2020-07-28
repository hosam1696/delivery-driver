import {Component, Input, Inject} from '@angular/core';
import {DriverOrder} from "../../providers/types/app-types";

@Component({
  selector: 'driver-request',
  templateUrl: 'request.html'
})
export class RequestComponent {

  @Input('request') request: DriverOrder;

  constructor(@Inject('DOMAIN_URL') public domainUrl) {
  }

  fillImgSrc(src: string): string {

    return src.startsWith('/storage')?this.domainUrl.concat(src):src;
  }
}
