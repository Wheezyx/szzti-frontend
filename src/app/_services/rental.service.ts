import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Pageable } from '@app/_models/pageable';
import { Page } from '@app/_models/page';
import { Rental } from '@app/_models/rental';
import { RentalSave } from '@app/_models/rental-save';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private rentalsUrl = environment.apiUrl + "/rentals";

  constructor(private http: HttpClient) { }


  public getPage(pageable: Pageable, filterParams: Map<String, String>): Observable<Page<Rental>> {
    const params = this.prepareParams(filterParams);
    const requestUrl =
      this.rentalsUrl +
      "?page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Rental>>(requestUrl, {params: params});
  }

  saveWithMutipleItems(rental: RentalSave) {
    return this.http.post<void>(this.rentalsUrl, rental).pipe(first());
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.rentalsUrl + "/" + id);
  }

  generateRentalRenterReport(renterId: string) {
    return this.http.post(
      environment.apiUrl + "/report/renters/ " + renterId + "/rentals-report",
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
