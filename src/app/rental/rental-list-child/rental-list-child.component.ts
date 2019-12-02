import { ToastrService } from "ngx-toastr";
import { AfterViewInit, ViewChild } from "@angular/core";
import { Component, OnInit, Input } from "@angular/core";
import { merge, of as observableOf } from "rxjs";
import { MatPaginator, MatTableDataSource, MatDialog } from "@angular/material";
import { startWith, switchMap, map, catchError } from "rxjs/operators";
import { Pageable } from "@app/_models/pageable";
import { RentalService } from "@app/_services/rental.service";
import { Rental } from "@app/_models/rental";
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";
import { ConfirmationDialogComponent } from "@app/shared/confirmation-dialog/confirmation-dialog.component";
import { AuthenticationService } from "@app/_services/authentication.service";

@Component({
  selector: "app-rental-list-child",
  templateUrl: "./rental-list-child.component.html",
  styleUrls: ["./rental-list-child.component.css"]
})
export class RentalListChildComponent implements AfterViewInit, OnInit {
  @Input() placeId: string;
  @Input() itemId: string;
  @Input() renterId: string;

  private params: Map<String, String>;
  loading = true;
  resultsLength = 0;

  dataSource = new MatTableDataSource<Rental>();
  displayedColumns = ["select", "itemName", "placeName", "renterCode"];
  selection = new SelectionModel<Rental>(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private rentalService: RentalService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.params = new Map<String, String>();
    this.params.set("placeId", this.placeId);
    this.params.set("itemId", this.itemId);
    this.params.set("renterId", this.renterId);
    this.selection.isSelected = this.isChecked.bind(this);
    this.selection.toggle = this.toggle.bind(this);
    console.log(this.params);
  }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;

          const page = new Pageable();
          page.pageNumber = this.paginator.pageIndex;
          page.pageSize = this.paginator.pageSize;
          return this.rentalService.getPage(page, this.params);
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
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(rental?: Rental): string {
    if (!rental) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${
      this.selection.isSelected(rental) ? "deselect" : "select"
    } row ${rental}`;
  }

  isChecked(row: any): boolean {
    const found = this.selection.selected.find(
      el => el.item.id === row.item.id
    );
    return found != null;
  }

  toggle(row: any) {
    console.log("PRZED:" + this.selection.selected.length);
    const found = this.selection.selected.find(
      el => el.item.id === row.item.id
    );
    if (!found) {
      this.selection.select(row);
    } else {
      const index = this.selection.selected.find(
        el => el.item.id === row.item.id
      );
      this.selection.deselect(index);
    }
    console.log("PO:" + this.selection.selected.length);
  }

  handleViewItem(id: String) {
    this.router.navigate(["items/view/", id]);
  }

  handleViewRenter(id: String) {
    this.router.navigate(["renters/view/", id]);
  }

  handleViewPlace(id: String) {
    this.router.navigate(["palces/view/", id]);
  }

  openDeleteConfirmationDialog(rental: Rental) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data: "Czy na pewno chcesz odpisać przedmiot?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rentalService.remove(rental.id).subscribe(resp => {
          this.toastr.success("Pomyślnie odpisano przedmiot");
          this.paginator.page.emit();
        });
      }
    });
  }

  generatePlaceRaport(event) {
    console.log(this.selection.selected);
  }

  generateRenterRaport(event) {
    this.rentalService.generateRentalRenterReport(this.renterId).subscribe(data => {
      let blob = new Blob([data], { type: "application/pdf"});
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'formularz-przekazania.pdf';
      link.click();

      // let url = window.URL.createObjectURL(blob);
      // window.open(url, '_blank');
    })
  }
}
