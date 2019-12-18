import { ToastrService } from "ngx-toastr";
import { ItemService } from "../../_services/item.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { forkJoin } from 'rxjs';
import { MatInput } from '@angular/material';

@Component({
  selector: "app-item-add",
  templateUrl: "./item-add.component.html",
  styleUrls: ["./item-add.component.css"]
})
export class ItemAddComponent implements OnInit {
  addItemForm: FormGroup;
  submitted = false;
  loading = false;

  @ViewChild('dateInput', {read: MatInput, static: false}) dateInput: MatInput;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.addItemForm = this.formBuilder.group({
      fullItemName: ["", Validators.required],
      dateOfDelivery: ['', Validators.required],
      description: ["", Validators.required],
      equipment: [false],
      genericName: ["", Validators.required],
      insideType: ["", Validators.required],
      inventoryCode: ["", Validators.required],
      itemType: ["", Validators.required],
      placeOfPosting: ["", Validators.required],
      itemsToAdd: [1, Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])]
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

    const itemsToAdd = this.addItemForm.value.itemsToAdd;
    this.loading = true;

    const calls = [];
    for(var i=0; i<itemsToAdd; i++) {
      calls.push(this.itemService
        .save(this.addItemForm.value));
    }

    forkJoin(calls).pipe(first())
    .subscribe(response => {
      this.toastr.success("Pomyślnie zapisano przedmiot.");
      this.addItemForm.reset();
      this.addItemForm.clearValidators();
      this.dateInput.value = '';
      this.submitted = false;
      this.loading = false;
    });
  }

  date(event) {
    const covertedDate = new Date(event.target.value).toISOString();
    this.addItemForm.get('dateOfDelivery').setValue(covertedDate, {onlyself: true});
  }
}
