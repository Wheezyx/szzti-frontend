import { map, first } from "rxjs/operators";
import { environment } from "@environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Item } from "@app/_models/item";
import { Page } from "@app/_models/page";
import { Observable } from "rxjs";
import { Pageable } from "@app/_models/pageable";

@Injectable({
  providedIn: "root"
})
export class ItemService {
  private itemsUrl = environment.apiUrl + "/items";

  constructor(private http: HttpClient) {}

  public getPage(
    pageable: Pageable,
    filterParams: Map<String, String>
  ): Observable<Page<Item>> {
    const params = this.prepareParams(filterParams);
    const requestUrl =
      this.itemsUrl +
      "?page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Item>>(requestUrl, { params: params });
  }

  public save(item: Item) {
    return this.http.post<Item>(this.itemsUrl, item).pipe(first());
  }

  getById(id: String): Observable<Item> {
    return this.http.get<Item>(this.itemsUrl + "/" + id);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.itemsUrl + "/" + id);
  }

  exportToCsv(ids: Array<string>) {
    return this.http.post(this.itemsUrl + "/export", ids, {
      params: { format: "csv" },
      responseType: "text"
    });
  }

  generateDamageReport(itemId: string) {
    return this.http.post(
      environment.apiUrl + "/report/items/ " + itemId + "/damage-report",
      null, {responseType: 'blob'}
    );
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
