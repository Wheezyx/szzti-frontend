import { Observable } from "rxjs";
import { Page } from "@app/_models/page";
import { Injectable } from "@angular/core";
import { Pageable } from "@app/_models/pageable";
import { Place } from "@app/_models/place";
import { environment } from "@environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PlaceService {
  private placesUrl = environment.apiUrl + "/places";

  constructor(private http: HttpClient) {}

  getPage(pageable: Pageable,  filterParams: Map<String, String>): Observable<Page<Place>> {
    const params = this.prepareParams(filterParams);
    const requestUrl =
      this.placesUrl +
      "?page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Place>>(requestUrl, {params: params});
  }

  getById(id: String): Observable<Place> {
    return this.http.get<Place>(this.placesUrl + "/" + id);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.placesUrl + "/" + id)
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
