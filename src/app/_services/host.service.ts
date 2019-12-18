import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { first } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pageable } from '@app/_models/pageable';
import { Page } from '@app/_models/page';
import { Observable } from 'rxjs';
import { Host } from '@app/_models/host';

@Injectable({
  providedIn: 'root'
})
export class HostService {

  private hostsUrl = environment.apiUrl + "/hosts";

  constructor(private http: HttpClient) {}

  public getPage(
    pageable: Pageable,
    filterParams: Map<String, String>
  ): Observable<Page<Host>> {
    const params = this.prepareParams(filterParams);
    const requestUrl =
      this.hostsUrl +
      "?page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Host>>(requestUrl, { params: params });
  }

  public save(host: Host) {
    return this.http.post<Host>(this.hostsUrl, host).pipe(first());
  }

  getById(id: String): Observable<Host> {
    return this.http.get<Host>(this.hostsUrl + "/" + id);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.hostsUrl + "/" + id);
  }

  update(hostId: string, host: Host) {
    return this.http
      .put<Host>(this.hostsUrl + "/" + hostId, host)
      .pipe(first());
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
}
