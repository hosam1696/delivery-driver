import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';


@Injectable()
export class NotificationsProvider {

  constructor(public api: ApiProvider) {
  }
  

  getNotifications(token: string) {
    return this.api.get('notifications', {api_token: token});
  }

}
