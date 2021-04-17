import {
  Observable,
  throwError
} from 'rxjs';

import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';

import {
  catchError,
  map
} from 'rxjs/operators';

import {
  Injectable
} from '@angular/core';

import {
  urlProd
} from '../index.url';

import {
  Apis
} from '../index.endpoints';

@Injectable({
  providedIn: 'root'
})
export class GlbserviceService {

  constructor(public http: HttpClient) { }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error has been occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  handleLogin(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }

    let url = urlProd + Apis.login; 
    console.log(url)
    return this.http.post(url, JSON.stringify(data), httpOptions)
  }

  handleGetLocation() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    }
    let url = urlProd + Apis.getUbication; 
    console.log(url)
    return this.http.get(url, httpOptions)
  }

  handleGetTarimas(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    }
    let url = urlProd + Apis.getTarima + data.idTarima; 
    console.log(url)
    return this.http.get(url, httpOptions)
  }

  handleGetTarimasDetail(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    }
    let url = urlProd + Apis.getTarima + data.idTarima + "/Cajas"; 
    console.log(url)
    return this.http.get(url, httpOptions)
  }

  handleGetCaja(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    }
    let url = urlProd + Apis.getCaja + data.idcaja; 
    console.log(url)
    return this.http.get(url, httpOptions)
  }

  handlePostTransfer(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }

    let url = urlProd + Apis.transferTarima; 
    console.log(url)
    return this.http.post(url, data, httpOptions)
  }

  handlePostReciveTransfer(data) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }

    let url = urlProd + Apis.reciveTarima; 
    console.log(url)
    return this.http.post(url, data, httpOptions)
  }

}
