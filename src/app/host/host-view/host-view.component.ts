import { ConnectionInterfaceService } from './../../_services/connection-interface.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HostService } from '@app/_services/host.service';
import { Host } from '@app/_models/host';
import { ItemService } from '@app/_services/item.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Item } from '@app/_models/item';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ConnectionInterface } from '@app/_models/connection-interface';
import { first, map, catchError,  } from 'rxjs/operators';
import { Pageable } from '@app/_models/pageable';
import { of as observableOf, empty } from "rxjs";
import { AuthenticationService } from '@app/_services/authentication.service';
import { ConfirmationDialogComponent } from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.css']
})
export class HostViewComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  host: Host;
  item: Item;
  loading = true;
  connectionInterfaces: MatTableDataSource<ConnectionInterface>;
  displayedColumns: string[] = ['ip', 'MAC', 'socketNumber', 'vlan', 'patchPanel', 'connectionName', 'connectionNumber', 'actions'];

  constructor(
    private hostService: HostService,
    private itemService: ItemService,
    private connectionInterfaceService: ConnectionInterfaceService,
    private router: Router,
    private acivatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public authenticationService: AuthenticationService
  ) {
    this.connectionInterfaces = new MatTableDataSource();
  }

  ngOnInit() {
    this.connectionInterfaces.paginator = this.paginator;
    this.connectionInterfaces.sort = this.sort;
    this.acivatedRoute.params.subscribe((params: Params) => {
      this.getHost(params.id)
    });
  }
  getHost(id: string) {
    this.hostService.getById(id).pipe(first())
    .subscribe(host => {
      this.host= host;
      this.connectionInterfaces.data = host.connectionInterfaces;
      this.getItem(host.inventoryCode);
    })
  }

  getItem(code: string) {
    const params = new Map<String, String>();
    params.set("code", code);
    this.itemService.getPage(new Pageable(), params)
    .pipe(
      map(page => {
        this.loading = false;
        return page.content[0];
      }),
      catchError(() => {
        this.loading = false;
        return observableOf(null);
      })
    )
    .subscribe(item => (this.item = item));
  }

  applyFilter(filterValue: string) {
    this.connectionInterfaces.filter = filterValue.trim().toLowerCase();

    if (this.connectionInterfaces.paginator) {
      this.connectionInterfaces.paginator.firstPage();
    }
  }

    openDeleteConfirmationDialog(connectionInterface: ConnectionInterface) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data:
        "Czy na pewno chcesz usunąć interfejs o adresie: " +
        connectionInterface.ip +
        "?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.connectionInterfaceService.remove(connectionInterface.id).subscribe(resp => {
          this.toastr.success("Pomyślnie usunięto.");
          let index = this.connectionInterfaces.data.findIndex(row => row === connectionInterface);
          this.connectionInterfaces.data.splice(index, 1);
          this.connectionInterfaces._updateChangeSubscription();
        });
      }
    });
  }

  handleEdit(id: string) {
    this.router.navigate(["/connection-interface/edit", id], {
      state: this.host
    });
  }

  handleAdd() {
    this.router.navigate(["/connection-interface/add"], {
      state: this.host
    });
  }

}
