import {Injectable, Inject} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {Events} from "ionic-angular";

@Injectable()

export class ApiProvider {
  private API_URL: string = this.domainUrl.concat('/api/delivery-driver/');
  private chosenLang: 'en' | 'ar';

  constructor( @Inject('DOMAIN_URL') private domainUrl,public http: HttpClient, private translate: TranslateService, private events: Events) {
    this.events.subscribe('change:lang', lang => this.chosenLang = lang);
  }

  get(endpoint: string, params?: any) {
    let httpParams: HttpParams = new HttpParams({});
    if (params) {
      for (let param in params) {
        if (params.hasOwnProperty(param))
          httpParams = httpParams.set(param, params[param])
      }
    }
    return this.http.get<any>(this.API_URL + endpoint, {params: httpParams})
  }

  post(endpoint: string, body?: any, params?: any, headers?: any) {
    let httpParams: HttpParams = new HttpParams({});
    let httpHeaders: HttpHeaders = new HttpHeaders({});

    httpParams = httpParams.set('local', this.translate.currentLang);

    if (params) {
      for (let param in params) {
        if (params.hasOwnProperty(param)) {
          httpParams = httpParams.set(param, params[param])
        }
      }
    }
    if (httpHeaders) {
      for (let header in headers) {
        if (headers.hasOwnProperty(header)) {
          httpHeaders = httpHeaders.set(header, headers[header])
        }
      }
    }
    return this.http.post<any>(this.API_URL + endpoint, body, {
      params: httpParams,
      headers: httpHeaders
    })


  }
}
