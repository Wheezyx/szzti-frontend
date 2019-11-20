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
import { ItemType } from "@app/_models/item-type";
import { Router } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { ConfirmationDialogComponent } from "@app/shared/confirmation-dialog/confirmation-dialog.component";
import { AuthenticationService } from '@app/_services/authentication.service';

@Component({
  selector: "app-item-list",
  styleUrls: ["item-list.component.css"],
  templateUrl: "item-list.component.html"
})
export class ItemListComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("codeFilter", { static: false }) codeFilter: ElementRef;

  displayedColumns: string[] = [
    "select",
    "fullItemName",
    "inventoryCode",
    "itemType",
    "insideType",
    "actions"
  ];
  data: Item[] = [];
  params: Map<String, String> = new Map();
  itemTypeEnum = ItemType;
  resultsLength = 0;
  loading = true;
  selection = new SelectionModel<Item>(true, []);
  rentedFilters = [
    { value: "skipRented", viewValue: "Pokaż tylko niewypożyczone" },
    { value: "skipNotRented", viewValue: "Pokaż tylko wypożyczone" },
    { value: "", viewValue: "Pokaż wszystkie" }
  ];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    this.selection.isSelected = this.isChecked.bind(this);
    this.selection.toggle = this.toggle.bind(this);
  }

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

  checkboxLabel(item?: Item): string {
    return `${
      this.selection.isSelected(item) ? "deselect" : "select"
    } row ${item}`;
  }

  isChecked(row: any): boolean {
    const found = this.selection.selected.find(el => el.id === row.id);
    return found != null;
  }

  toggle(row: any) {
    console.log("PRZED:" + this.selection.selected.length);
    const found = this.selection.selected.find(el => el.id === row.id);
    if (!found) {
      this.selection.select(row);
    } else {
      this.selection.deselect(found);
    }

    console.log("PO:" + this.selection.selected.length);
  }

  changeRentedFilter(value: string) {
    this.rentedFilters.forEach(element => {
      this.params.delete(element.value);
    });
    this.params.set(value, "true");
    this.paginator.page.emit();
  }

  exportSelected(event) {
    const ids = this.selection.selected.map(item => item.id);
    if (ids.length === 0) {
      this.toastr.error("Nie wybrałeś żadnych przedmiotów do wyeksportowania");
    }
    this.itemService.exportToCsv(ids).subscribe(response => {
      let blob = new Blob(["\ufeff", response], { type: "text/csv"});
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'test.csv';
      link.click();
    });
  }

  checkIfAllSelectedAreNotRented() {
    const array = this.selection.selected.filter(item => item.rented === true);
    return array.length > 0;
  }

  rentSelected(event) {
    console.log("Selected items: " + this.selection.selected);
    this.router.navigate(["/rentals/add"], {
      state: this.selection.selected.length > 0 ? this.selection.selected : null
    });
  }

  openDeleteConfirmationDialog(item: Item) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data:
        "Czy na pewno chcesz usunąć przedmiot o kodzie: " +
        item.inventoryCode +
        "?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.remove(item.id).subscribe(resp => {
          this.toastr.success("Pomyślnie usunięto przedmiot");
          this.paginator.page.emit();
        });
      }
    });
  }
}
