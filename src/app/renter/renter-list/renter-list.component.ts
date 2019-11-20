import { RenterService } from './../../_services/renter.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Renter } from '@app/_models/renter';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, startWith, switchMap, catchError, map } from 'rxjs/operators';
import { Pageable } from '@app/_models/pageable';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '@app/shared/confirmation-dialog/confirmation-dialog.component';
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: 'app-renter-list',
  templateUrl: './renter-list.component.html',
  styleUrls: ['./renter-list.component.css']
})
export class RenterListComponent implements AfterViewInit {

  displayedColumns: string[] = ["name", "surname", "code", "actions"];
  data: Renter[] = [];
  searchParams = new Map<String, String>();


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("codeFilter", { static: false }) codeFilter: ElementRef;

  loading = true;
  resultsLength = 0;

  constructor(private renterService: RenterService, private router: Router, private dialog: MatDialog, private toastr: ToastrService, private authenticationService: AuthenticationService) { }

  ngAfterViewInit() {
    fromEvent(this.codeFilter.nativeElement, "keyup")
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => {
          this.searchParams.set("code", this.codeFilter.nativeElement.value);
          this.paginator.page.emit();
        })
      )
      .subscribe();

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;

          const page = new Pageable();
          page.pageNumber = this.paginator.pageIndex;
          page.pageSize = this.paginator.pageSize;
          return this.renterService.getPage(page, this.searchParams);
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


  handleView(id: String) {
    console.log(id);
    this.router.navigate(['renters/view/', id]);
  }

  openDeleteConfirmationDialog(renter: Renter) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Czy na pewno chcesz usunąć osobę o kodzie: " + renter.code + "? Wszystkie wypożyczone jemu przedmioty zostaną odpisane."
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.renterService.remove(renter.id).subscribe(resp => {
          this.toastr.success("Pomyślnie usunięto osobę");
          this.paginator.page.emit();
        })
      }
    });
  }

}
