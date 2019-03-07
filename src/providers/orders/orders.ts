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

  getOrderDetails(orderId, token) {
    return this.api.get('order-details', {api_token: token, order_id: orderId})
  }

  refuseOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/canceled'), null, {api_token: token})

  }

  cancelOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/refused'), null, {api_token: token})

  }

  awaitOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/waiting'), null, {api_token: token})

  }

  acceptOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/accepted'), null, {api_token: token})
  }

}
