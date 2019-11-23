import { RenterService } from './../../_services/renter.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Renter } from '@app/_models/renter';

@Component({
  selector: 'app-renter-view',
  templateUrl: './renter-view.component.html',
  styleUrls: ['./renter-view.component.css']
})
export class RenterViewComponent implements OnInit {

  renter :Renter;
  private loading = true;
  constructor(private renterService: RenterService, private acivatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.acivatedRoute.params.subscribe((params: Params) => {
      this.getRenter(params.id)
    });
  }


  ngAfterViewInit(): void {
  }

  getRenter(id: String) {
    this.renterService.getById(id).subscribe(renter => {
      this.renter = renter;
      this.loading = false;
    });
  }

}
