import { PlaceService } from './../../_services/place.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Place } from '@app/_models/place';

@Component({
  selector: 'app-place-view',
  templateUrl: './place-view.component.html',
  styleUrls: ['./place-view.component.css']
})
export class PlaceViewComponent implements OnInit, AfterViewInit {
  
  place:Place;
  private loading = true;
  constructor(private placeService: PlaceService, private acivatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.acivatedRoute.params.subscribe((params: Params) => {
      this.getPlace(params.id)
    });
  }


  ngAfterViewInit(): void {
    throw new Error("Method not implemented.");
  }

  getPlace(id: String) {
    this.placeService.getById(id).subscribe(place => {
      this.place = place;
      this.loading = false;
    });


  }

}
