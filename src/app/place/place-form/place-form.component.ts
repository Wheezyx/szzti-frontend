import { PlaceService } from "./../../_services/place.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, Params } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { first } from 'rxjs/operators';

@Component({
  selector: "app-place-form",
  templateUrl: "./place-form.component.html",
  styleUrls: ["./place-form.component.css"]
})
export class PlaceFormComponent implements OnInit {
  public editStatus = false;
  placeForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private placeService: PlaceService,
    private acivatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.placeForm = this.formBuilder.group({
      name: ["", Validators.required],
      id: [null]
    });

    this.acivatedRoute.params.subscribe((params: Params) => {
      if (params.id !== undefined) {
        this.editStatus = true;
        this.getPlaceAndInitializeForm(params.id);
      }
    });
  }

  private getPlaceAndInitializeForm(id: String) {
    this.loading = true;
    this.placeService.getById(id).subscribe(place => {
      this.placeForm = this.formBuilder.group({
        name: [place.name, Validators.required],
        id: [place.id]
      });
      this.loading = false;
    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.placeForm.valid) {
      this.submitted = false;
      return;
    }

    this.loading = true;
    if (!this.editStatus) {
      this.placeService
        .save(this.placeForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zapisano wypożyczającego");
          this.loading = false;
          this.router.navigate(['places']);
        });
    }
    if (this.editStatus) {
      const renterId = this.placeForm.value.id;

      this.placeService
        .update(renterId, this.placeForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zaaktualizowano wypożyczającego");
          this.loading = false;
          this.router.navigate(['places']);
        });
    }
    this.loading = false;
  }
}
