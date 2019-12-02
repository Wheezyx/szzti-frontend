import { map } from "rxjs/operators";
import { RentalService } from "@app/_services/rental.service";
import { ItemService } from "@app/_services/item.service";
import { Component, OnInit } from "@angular/core";
import { Item } from "@app/_models/item";
import { Rental } from "@app/_models/rental";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Pageable } from "@app/_models/pageable";

@Component({
  selector: "app-item-view",
  templateUrl: "./item-view.component.html",
  styleUrls: ["./item-view.component.css"]
})
export class ItemViewComponent implements OnInit {
  item: Item;
  rental: Rental;
  private pageable = new Pageable();
  loading = true;
  rentalLoading = true;

  constructor(
    private itemService: ItemService,
    private rentalService: RentalService,
    private router: Router,
    private acivatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.acivatedRoute.params.subscribe((params: Params) => {
      this.getItem(params.id);
      this.getRental(params.id);
    });
  }

  getItem(id: String) {
    this.loading = true;
    this.itemService.getById(id).subscribe(item => {
      this.item = item;
      this.loading = false;
    });
  }
  getRental(itemId: String) {
    this.rentalLoading = true;
    let map = new Map<String, String>();
    map.set("itemId", itemId);

    this.rentalService.getPage(this.pageable, map).subscribe(rentalPage => {
      if (rentalPage.content.length > 0) {
        this.rental = rentalPage.content.pop();
      }
      this.rentalLoading = false;
    });
  }
  handleViewPlace(id: String) {
    console.log(id);
    this.router.navigate(["places/view/", id]);
  }
  handleViewRenter(id: String) {
    console.log(id);
    this.router.navigate(["renter/view/", id]);
  }

  generateDamageReport($event) {
    this.itemService.generateDamageReport(this.item.id).subscribe(data => {
      let blob = new Blob([data], { type: "application/pdf"});
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'protokol-uszkodzenia-sprzetu.pdf';
      link.click();

      // let url = window.URL.createObjectURL(blob);
      // window.open(url, '_blank');
    })
  }

}
