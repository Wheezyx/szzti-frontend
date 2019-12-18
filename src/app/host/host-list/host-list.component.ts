import { HostService } from './../../_services/host.service';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { startWith, switchMap, map, catchError, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Pageable } from '@app/_models/pageable';
import { MatPaginator, MatDialog } from '@angular/material';
import { fromEvent, of as observableOf, merge } from "rxjs";
import { AuthenticationService } from '@app/_services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import { Host } from '@app/_models/host';

@Component({
  selector: 'app-host-list',
  templateUrl: './host-list.component.html',
  styleUrls: ['./host-list.component.css']
})
export class HostListComponent implements AfterViewInit {

  displayedColumns: string[] = ["name","place","actions"];
  data: Host[] = [];
  searchParams = new Map<String, String>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild("nameFilter", { static: false }) nameFilter: ElementRef;
  @ViewChild("placeFilter", { static: false }) placeFilter: ElementRef;
  @ViewChild("inventoryCodeFilter", { static: false }) inventoryCodeFilterFilter: ElementRef;
  @ViewChild("ipFilter", { static: false }) ipFilter: ElementRef;
  @ViewChild("macFilter", { static: false }) macFilter: ElementRef;
  @ViewChild("patchPanelFilter", { static: false }) patchPanelFilter: ElementRef;
  @ViewChild("connectionNameFilter", { static: false }) connectionNameFilter: ElementRef;
  @ViewChild("connectionNumberFilter", { static: false }) connectionNumberFilter: ElementRef;



  loading: boolean = true;
  resultsLength: any = 0;

  constructor(
    private hostService: HostService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public authenticationService: AuthenticationService
  ) {}

  ngAfterViewInit() {
    this.configureFilterControl(this.nameFilter.nativeElement, "name");
    this.configureFilterControl(this.placeFilter.nativeElement, "place");;
    this.configureFilterControl(this.inventoryCodeFilterFilter.nativeElement, "inventoryCode");
    this.configureFilterControl(this.ipFilter.nativeElement, "ip");
    this.configureFilterControl(this.macFilter.nativeElement, "mac");
    this.configureFilterControl(this.patchPanelFilter.nativeElement, "patchPanel")
    this.configureFilterControl(this.connectionNameFilter.nativeElement, "connectionName");
    this.configureFilterControl(this.connectionNumberFilter.nativeElement, "connectionNumber");

    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;

          const page = new Pageable();
          page.pageNumber = this.paginator.pageIndex;
          page.pageSize = this.paginator.pageSize;
          console.log(this.searchParams);
          return this.hostService.getPage(page, this.searchParams);
        }),
        map(page => {
          this.loading = false;
          this.resultsLength = page.totalElements;

          return page.content;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = data));
  }

  private configureFilterControl(event, filterName) {
    fromEvent(event, "keyup")
      .pipe(debounceTime(800), distinctUntilChanged(), tap(() => {
        this.searchParams.set(filterName, event.value);
        this.paginator.page.emit();
      }))
      .subscribe();
  }

  handleView(id: String) {
    console.log(id);
    this.router.navigate(["hosts/view/", id]);
  }

  openDeleteConfirmationDialog(host: Host) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data:
        "Czy na pewno chcesz usunąć hosta: " +
        host.name +
        "? Wszystkie przypisane do tego hosta adresy zostaną również usunięte"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hostService.remove(host.id).subscribe(resp => {
          this.toastr.success("Pomyślnie usunięto miejsce");
          this.paginator.page.emit();
        });
      }
    });
  }

  handleEdit(id: string) {
    this.router.navigate(["/hosts/edit", id]);
  }

  handleAdd() {
    this.router.navigate(["hosts/add"]);
  }

}
