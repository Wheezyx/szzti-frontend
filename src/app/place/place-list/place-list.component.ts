import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Place } from '@app/_models/place';
import { MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge, of as observableOf } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Pageable } from '@app/_models/pageable';
import { PlaceService } from '@app/_services/place.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.css']
})
export class PlaceListComponent implements AfterViewInit {
  displayedColumns: string[] = ["name", "actions"];
  data: Place[] = [];
  searchParams = new Map<String, String>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("nameFilter", { static: false }) nameFilter: ElementRef;
  loading: boolean = true;
  resultsLength: any = 0;

  constructor(private placeService: PlaceService, private router: Router) { }

  ngAfterViewInit() {
    fromEvent(this.nameFilter.nativeElement, "keyup")
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => {
          this.searchParams.set("name", this.nameFilter.nativeElement.value);
          this.paginator.page.emit();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;

          const page = new Pageable();
          page.pageNumber = this.paginator.pageIndex;
          page.pageSize = this.paginator.pageSize;
          return this.placeService.getPage(page, this.searchParams);
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
    this.router.navigate(['places/view/', id]);
  }
}
