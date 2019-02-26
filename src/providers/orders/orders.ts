import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class OrdersProvider {

  constructor(public api:ApiProvider) {

  }

  getAllOrders(token) {
    return this.api.get('get-orders', {api_token: token})
  }

  getWaitingOrders(token) {
    return this.api.get('get-orders/waiting', {api_token: token})
  }

  changeDeliveringOrdersStatus(token) {
    return this.api.post('change-status', null, {api_token: token})
  }

}
