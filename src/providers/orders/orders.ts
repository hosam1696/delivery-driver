import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import {forkJoin} from 'rxjs/observable/forkJoin';
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
  
  getReturnedOrders(token) {
    return this.api.get('get-orders/returned', {api_token: token})
  }

  getCompletedOrders(token) {
    return this.api.get('get-orders/completed', {api_token: token})
  }

  getCanceledOrders(token) {
    return forkJoin(this.api.get('get-orders/canceled', {api_token: token}), this.api.get('get-orders/refused', {api_token: token}))
  }


  getOrderDetails(orderId, token) {
    return this.api.get('order-details', {api_token: token, order_id: orderId})
  }

  cancelOrder(orderId, token, comment) {
    let body = new FormData();
    body.append('reason', comment);
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

  returnOrder(orderId, token, comment?:string) {
    let body = new FormData();
    body.append('reason', comment);
    return this.api.post('order/'.concat(orderId, '/returned'), body, {api_token: token})
  }

  awaitOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/waiting'), null, {api_token: token})

  }

  acceptOrder(orderId, token) {
    return this.api.post('order/'.concat(orderId, '/accepted'), null, {api_token: token})
  }

}
