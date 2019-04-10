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

  getOrderDetails(orderId, token) {
    return this.api.get('order-details', {api_token: token, order_id: orderId})
  }

  cancelOrder(orderId, token, comment) {
    let body = new FormData();
    body.append('comment', comment);
    return this.api.post('order/'.concat(orderId, '/canceled'), body, {api_token: token})
  }

  deliverOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/completed'), null, {api_token: token})
  }

  receiveOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/ongoing'), null, {api_token: token})
  }

  processOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/processing'), null, {api_token: token})
  }

  refuseOrder(orderId, token, comment?:string) {
    return this.api.post('order/'.concat(orderId, '/refused'), null, {api_token: token, comment})
  }

  awaitOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/waiting'), null, {api_token: token})

  }

  acceptOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/accepted'), null, {api_token: token})
  }

}
