import { Item } from "@app/_models/item";
import { Component, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, Observable, of as observableOf, fromEvent } from "rxjs";
import {
  catchError,
  map,
  startWith,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  tap
} from "rxjs/operators";
import { ItemService } from "@app/_services/item.service";
import { Pageable } from "@app/_models/pageable";
import { ItemType } from '@app/_models/item-type';
import { Router } from '@angular/router';

@Component({
  selector: "app-item-list",
  styleUrls: ["item-list.component.css"],
  templateUrl: "item-list.component.html"
})
export class ItemListComponent implements AfterViewInit {
  displayedColumns: string[] = ["fullItemName", "inventoryCode", "itemType", "insideType", "actions"];
  data: Item[] = [];
  params: Map<String, String> = new Map();
  itemTypeEnum = ItemType;
  resultsLength = 0;
  loading = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("codeFilter", { static: false }) codeFilter: ElementRef;

  constructor(private itemService: ItemService, private router: Router) {}

  ngAfterViewInit() {
    fromEvent(this.codeFilter.nativeElement, "keyup")
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.params.set("code", this.codeFilter.nativeElement.value);
          this.sort.sortChange.emit();
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
          return this.itemService.getPage(page, this.params);
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
      this.router.navigate(["items/view/", id]);
  }
}
