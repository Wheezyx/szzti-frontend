import { ToastrService } from "ngx-toastr";
import { Renter } from "@app/_models/renter";
import { RenterService } from "./../../_services/renter.service";
import { ItemService } from "@app/_services/item.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Params, ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";

@Component({
  selector: "app-renter-form",
  templateUrl: "./renter-form.component.html",
  styleUrls: ["./renter-form.component.css"]
})
export class RenterFormComponent implements OnInit {
  public editStatus = false;
  renterForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private renterService: RenterService,
    private acivatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.renterForm = this.formBuilder.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      code: ["", Validators.required],
      id: [null]
    });

    this.acivatedRoute.params.subscribe((params: Params) => {
      if (params.id !== undefined) {
        this.editStatus = true;
        this.getRenterAndInitializeForm(params.id);
      }
    });
  }

  private getRenterAndInitializeForm(id: String) {
    this.loading = true;
    this.renterService.getById(id).subscribe(renter => {
      this.renterForm = this.formBuilder.group({
        name: [renter.name, Validators.required],
        surname: [renter.surname, Validators.required],
        code: [renter.code, Validators.required],
        id: [renter.id]
      });
      this.loading = false;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.renterForm.valid) {
      this.submitted = false;
      return;
    }

    this.loading = true;
    if (!this.editStatus) {
      this.renterService
        .save(this.renterForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zapisano wypożyczającego");
          this.loading = false;
          this.router.navigate(['renters']);
        });
    }
    if (this.editStatus) {
      const renterId = this.renterForm.value.id;

      this.renterService
        .update(renterId, this.renterForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zaaktualizowano wypożyczającego");
          this.loading = false;
          this.router.navigate(['renters']);
        });
    }
    this.loading = false;
  }
}
