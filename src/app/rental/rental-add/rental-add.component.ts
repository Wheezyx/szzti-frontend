import { ToastrService } from 'ngx-toastr';
import { RentalSave } from './../../_models/rental-save';
import { Pageable } from "./../../_models/pageable";
import { PlaceService } from "@app/_services/place.service";
import { RenterService } from "./../../_services/renter.service";
import { RentalService } from "./../../_services/rental.service";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Item } from "@app/_models/item";
import { Router } from "@angular/router";
import { Renter } from "@app/_models/renter";
import { Place } from "@app/_models/place";
import { map, catchError, startWith, tap, first } from "rxjs/operators";
import { of as observableOf, Observable } from "rxjs";
import {
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";

@Component({
  selector: "app-rental-add",
  templateUrl: "./rental-add.component.html",
  styleUrls: ["./rental-add.component.css"]
})
export class RentalAddComponent implements OnInit {
  itemsToRent: any;
  renters: Array<Renter>;
  places: Array<Place>;

  loading: boolean;

  placeControl = new FormControl();
  renterControl = new FormControl();

  filteredPlaces: Observable<Place[]>;
  filteredRenters: Observable<Renter[]>;

  constructor(
    private router: Router,
    private rentalService: RentalService,
    private renterService: RenterService,
    private placeService: PlaceService,
    private toastr: ToastrService
  ) {
    this.itemsToRent = router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.loading = true;
    const pageable = new Pageable();
    pageable.pageNumber = 0;
    //TODO CHANGE HARDCODED VALUE
    pageable.pageSize = 1000;

    this.renterService
      .getPage(pageable, new Map<String, String>())
      .pipe(
        map(page => {
          this.loading = false;
          return page.content;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      )
      .subscribe(renters => {
        const renter = new Renter();
        renter.code = "Brak";
        renters.push(renter);

        this.renters = renters;

        this.renterControl.validator = Validators.compose([
          Validators.required,
          RenterAutoCompleteValidator.valueSelected(this.renters)
        ]);
        
        this.filteredRenters = this.renterControl.valueChanges.pipe(
          startWith(""),
          map(value => (typeof value === "string" ? value : value.code)),
          map(code => (code ? this.filterRenters(code) : this.renters.slice()))
        );
      });

    this.placeService
      .getPage(pageable, new Map<String, String>())
      .pipe(
        map(page => {
          this.loading = false;
          return page.content;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      )
      .subscribe(places => {
        const place = new Place();
        place.name = "Brak";
        places.push(place);

        this.places = places;
        this.filteredPlaces = this.placeControl.valueChanges.pipe(
          startWith(""),
          map(value => (typeof value === "string" ? value : value.name)),
          map(name => (name ? this.filterPlaces(name) : this.places.slice()))
        );

        this.placeControl.validator = Validators.compose([
          Validators.required,
          PlaceAutoCompleteValidator.valueSelected(this.places)
        ]);
      });
  }

  private filterPlaces(name: string): Place[] {
    const filterValue = name.toLowerCase();
    return this.places.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  
  private filterRenters(code: string): Renter[] {
    const filterValue = code.toLowerCase();
    return this.renters.filter(
      option => option.code.toLowerCase().indexOf(filterValue) === 0
    );
  }

  displayPlaceName(place?: Place): string | undefined {
    return place ? place.name : undefined;
  }
  displayRenterCode(renter?: Renter): string | undefined {
    return renter ? renter.code : undefined;
  }

  confirmRental() {
    let rental = new RentalSave();
    rental.items = this.itemsToRent;
    rental.place = this.placeControl.value.name === 'Brak' ? null : this.placeControl.value;
    rental.renter = this.renterControl.value.code === 'Brak' ? null : this.renterControl.value;
    
    if (rental.renter === null && rental.place === null) {
      this.toastr.warning("Brak wypożyczającego oraz miejsca, wybierz przynajmniej jednego.");
      return;
    }

    this.rentalService
      .saveWithMutipleItems(rental)
      .pipe(first())
      .subscribe(item => {
        this.toastr.success("Pomyślnie dodano wypożyczenie.");
        if (this.renterControl.value.id !== undefined) {
          this.router.navigate(["renters/view/", this.renterControl.value.id]);
        } 
        else if (this.placeControl.value.id !== undefined) {
          this.router.navigate(["places/view/", this.placeControl.value.id]);
        }

      });
  }
}

export class PlaceAutoCompleteValidator {
  static valueSelected(myArray: Place[]): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      let selectboxValue = c.value;
      let pickedOrNot = myArray.filter(alias =>
        alias.name.includes(selectboxValue.name)
      );
      if (pickedOrNot.length > 0) {
        return null;
      } else {
        return { match: true };
      }
    };
  }
}
export class RenterAutoCompleteValidator {
  static valueSelected(myArray: Renter[]): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      let selectboxValue: Renter = c.value;
      let pickedOrNot = myArray.filter(alias =>
        alias.code.includes(selectboxValue.code)
      );
      if (pickedOrNot.length > 0) {
        return null;
      } else {
        return { match: true };
      }
    };
  }
}
