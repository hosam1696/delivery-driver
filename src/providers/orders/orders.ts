import {Injectable} from '@angular/core';
import {ApiProvider} from '../api/api';
import {DriverOrderResponse, OrderDetailsResponse, OrderStatus, OrderStatusResponse} from "../types/app-types";
import {Observable} from "rxjs";

@Injectable()
export class OrdersProvider {

  constructor(public api: ApiProvider) {
  }

  getDriverOrders(token, status?: OrderStatus): Observable<DriverOrderResponse> {
    return this.api.get('get-orders'.concat(status ? '/' + status : ''), {api_token: token})
  }

  getOrderDetails(orderId, token): Observable<OrderDetailsResponse> {
    return this.api.get('order-details', {api_token: token, order_id: orderId})
  }

  changeOrderStatus(orderStatus: OrderStatus, orderId: number, token: string, reason?: string): Observable<OrderStatusResponse> {
    let body = reason ? new FormData() : null;
    reason && body.append('reason', reason);
    return this.api.post('order/'.concat(String(orderId), '/', orderStatus), body, {api_token: token})
  }

}
