import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Renter } from '@app/_models/renter';
import { Page } from '@app/_models/page';
import { environment } from '@environments/environment';
import { Pageable } from '@app/_models/pageable';

@Injectable({
  providedIn: 'root'
})
export class RenterService {

  private rentersUrl = environment.apiUrl + '/renters';

  constructor(private http: HttpClient) { }

  getPage(pageable: Pageable, filterParams: Map<String, String>): Observable<Page<Renter>> {
    const params = this.prepareParams(filterParams);
    const requestUrl =
      this.rentersUrl +
      "?page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Renter>>(requestUrl, {params: params});
  }

  private prepareParams(filterParams: Map<String, String>): HttpParams {
    let params = new HttpParams();

    filterParams.forEach((value, key) => {
      if (key && value) {
        params = params.set(key.toString(), value.toString());
      }
    });
    return params;
  }
  getById(id: String): Observable<Renter> {
    return this.http.get<Renter>(this.rentersUrl + "/" + id);
  }
}
