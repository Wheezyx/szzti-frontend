import { HostService } from './../../_services/host.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-host-form',
  templateUrl: './host-form.component.html',
  styleUrls: ['./host-form.component.css']
})
export class HostFormComponent implements OnInit {

  public editStatus = false;
  hostForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private hostService: HostService,
    private acivatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.hostForm = this.formBuilder.group({
      name: ["", Validators.required],
      place: ["", Validators.required],
      inventoryCode: ["", Validators.required],
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
    this.hostService.getById(id).subscribe(host => {
      this.hostForm = this.formBuilder.group({
        name: [host.name, Validators.required],
        place: [host.place, Validators.required],
        inventoryCode: [host.inventoryCode, Validators.required],
        id: [host.id]
      });
      this.loading = false;
    });
  }
  onSubmit() {
    this.submitted = true;
    if (!this.hostForm.valid) {
      this.submitted = false;
      return;
    }

    this.loading = true;
    if (!this.editStatus) {
      this.hostService
        .save(this.hostForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zapisano hosta");
          this.loading = false;
          this.router.navigate(['hosts']);
        });
    }
    if (this.editStatus) {
      const renterId = this.hostForm.value.id;

      this.hostService
        .update(renterId, this.hostForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zaaktualizowano hosta");
          this.loading = false;
          this.router.navigate(['hosts']);
        });
    }
    this.loading = false;
  }

}
