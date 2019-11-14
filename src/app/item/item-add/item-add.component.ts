import { ToastrService } from "ngx-toastr";
import { ItemType } from "../../_models/item-type";
import { InsideType } from "../../_models/inside-type";
import { ItemService } from "../../_services/item.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

@Component({
  selector: "app-item-add",
  templateUrl: "./item-add.component.html",
  styleUrls: ["./item-add.component.css"]
})
export class ItemAddComponent implements OnInit {
  addItemForm: FormGroup;
  submitted = false;
  loading = false;
  keys = Object.keys;
  insideTypeEnum = InsideType;
  itemTypeEnum = ItemType;

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
      //genericName: ["", Validators.required],
      insideType: ["", Validators.required],
      inventoryCode: ["", Validators.required],
      itemType: ["", Validators.required],
      placeOfPosting: ["", Validators.required],
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
    this.itemService
      .save(this.addItemForm.value)
      .pipe(first())
      .subscribe(item => {
        this.toastr.success("Pomyślnie zapisano przedmiot.");
        this.addItemForm.reset();
      });
    this.submitted = false;
    this.loading = false;
  }

  date(event) {
    const covertedDate = new Date(event.target.value).toISOString();
    this.addItemForm.get('dateOfDelivery').setValue(covertedDate, {onlyself: true});
  }
}
