import { RenterService } from './../../_services/renter.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Renter } from '@app/_models/renter';
import { MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, startWith, switchMap, catchError, map } from 'rxjs/operators';
import { Pageable } from '@app/_models/pageable';

@Component({
  selector: 'app-renter-list',
  templateUrl: './renter-list.component.html',
  styleUrls: ['./renter-list.component.css']
})
export class RenterListComponent implements AfterViewInit {

  displayedColumns: string[] = ["name", "surname", "code", "actions"];
  data: Renter[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("codeFilter", { static: false }) codeFilter: ElementRef;

  loading = true;
  resultsLength = 0;

  constructor(private renterService: RenterService, private router: Router) { }

  ngAfterViewInit() {
    fromEvent(this.codeFilter.nativeElement, "keyup")
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => {
          throw new Error("Method not implemented." + this.codeFilter.nativeElement.value);
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
          return this.renterService.getPage(page, new Map<String,String>());
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

}
