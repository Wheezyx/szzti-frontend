import { RenterService } from './../../_services/renter.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-renter-add',
  templateUrl: './renter-add.component.html',
  styleUrls: ['./renter-add.component.css']
})
export class RenterAddComponent implements OnInit {

  addItemForm: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private renterService: RenterService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.addItemForm = this.formBuilder.group({
      name: ["", Validators.required],
      surname: ["", Validators.required],
      code: ["", Validators.required],
    });
  }

  get f() {
    return this.addItemForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    if (!this.addItemForm.valid) {
      this.submitted = false;
      return;
    }
    this.loading = true;
    this.renterService
      .save(this.addItemForm.value)
      .pipe(first())
      .subscribe(item => {
        this.toastr.success("Pomyślnie zapisano wypożyczającego");
        this.addItemForm.reset();
      });
    this.submitted = false;
    this.loading = false;
  }
}
