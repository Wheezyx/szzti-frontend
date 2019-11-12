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

  getPage(pageable: Pageable): Observable<Page<Place>> {
    const requestUrl =
      this.placesUrl +
      "?page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Place>>(requestUrl);
  }

  getById(id: String): Observable<Place> {
    return this.http.get<Place>(this.placesUrl + "/" + id);
  }
}
