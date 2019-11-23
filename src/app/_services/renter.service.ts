import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Renter } from "@app/_models/renter";
import { Page } from "@app/_models/page";
import { environment } from "@environments/environment";
import { Pageable } from "@app/_models/pageable";
import { first } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class RenterService {
  private rentersUrl = environment.apiUrl + "/renters";

  constructor(private http: HttpClient) {}

  getPage(
    pageable: Pageable,
    filterParams: Map<String, String>
  ): Observable<Page<Renter>> {
    const params = this.prepareParams(filterParams);
    const requestUrl =
      this.rentersUrl +
      "?page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Renter>>(requestUrl, { params: params });
  }

  getById(id: String): Observable<Renter> {
    return this.http.get<Renter>(this.rentersUrl + "/" + id);
  }

  public save(renter: Renter): Observable<Renter> {
    return this.http.post<Renter>(this.rentersUrl, renter).pipe(first());
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.rentersUrl + "/" + id);
  }

  update(id: string, renter: Renter): Observable<Renter> {
    return this.http.put<Renter>(this.rentersUrl + "/" + id, renter).pipe(first());
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
