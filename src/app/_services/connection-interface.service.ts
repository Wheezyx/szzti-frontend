import { ConnectionInterface } from "./../_models/connection-interface";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { first } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ConnectionInterfaceService {
  private connectionInterfacesUrl =
    environment.apiUrl + "/connectionInterfaces";

  constructor(private http: HttpClient) {}

  public save(connectionInterface: ConnectionInterface) {
    return this.http
      .post<ConnectionInterface>(
        this.connectionInterfacesUrl,
        connectionInterface
      )
      .pipe(first());
  }

  getById(id: String): Observable<ConnectionInterface> {
    return this.http.get<ConnectionInterface>(
      this.connectionInterfacesUrl + "/" + id
    );
  }

  update(ciId: string, connectionInterface: ConnectionInterface) {
    return this.http
      .put<ConnectionInterface>(
        this.connectionInterfacesUrl + "/" + ciId,
        connectionInterface
      )
      .pipe(first());
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.connectionInterfacesUrl + "/" + id);
  }
}
