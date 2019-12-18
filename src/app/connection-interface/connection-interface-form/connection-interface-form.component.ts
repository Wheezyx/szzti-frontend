import { ConnectionInterfaceService } from './../../_services/connection-interface.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Pageable } from '@app/_models/pageable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-connection-interface-form',
  templateUrl: './connection-interface-form.component.html',
  styleUrls: ['./connection-interface-form.component.css']
})
export class ConnectionInterfaceFormComponent implements OnInit {

  host: any;
  loading: boolean;
  submitted = false;
  connectionInterfaceForm: FormGroup;
  public editStatus = false;


  constructor(
    private router: Router,
    private connectionInterfaceService: ConnectionInterfaceService,
    private toastr: ToastrService,
    private acivatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.host = router.getCurrentNavigation().extras.state;
  }

  ngOnInit() {
    this.connectionInterfaceForm = this.formBuilder.group({
    ip: ["", Validators.required],
    mac:  ["", Validators.required],
    socketNumber:  ["", Validators.required],
    vlan: ["", Validators.required],
    patchPanel:  ["", Validators.required],
    connectionName:  ["", Validators.required],
    connectionNumber:  ["", Validators.required],
    hostId: [this.host !== undefined ? this.host.id : null],
    id: [null]
    });

    this.acivatedRoute.params.subscribe((params: Params) => {
      if (params.id !== undefined) {
        this.editStatus = true;
        this.getConnectionInterfaceAndInitializeForm(params.id);
      }
    });
  }

  private getConnectionInterfaceAndInitializeForm(id: String) {
    this.loading = true;
    this.connectionInterfaceService.getById(id).subscribe(ci => {
      this.connectionInterfaceForm = this.formBuilder.group({
        ip: [ci.ip, Validators.required],
        mac:  [ci.mac, Validators.required],
        socketNumber:  [ci.socketNumber, Validators.required],
        vlan: [ci.vlan, Validators.required],
        patchPanel:  [ci.patchPanel, Validators.required],
        connectionName:  [ci.connectionName, Validators.required],
        connectionNumber:  [ci.connectionNumber, Validators.required],
        hostId: [this.host !== undefined ? this.host.id : null],
        id: [ci.id]
        
      });
      this.loading = false;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (!this.connectionInterfaceForm.valid) {
      this.submitted = false;
      return;
    }

    this.loading = true;
    if (!this.editStatus) {
      this.connectionInterfaceService
        .save(this.connectionInterfaceForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zapisano interfejs");
          this.loading = false;
          this.router.navigate(['hosts/view/' + this.host.id]);
        });
    }
    if (this.editStatus) {
      const renterId = this.connectionInterfaceForm.value.id;

      this.connectionInterfaceService
        .update(renterId, this.connectionInterfaceForm.value)
        .pipe(first())
        .subscribe(response => {
          this.toastr.success("Pomyślnie zaaktualizowano interfejs");
          this.loading = false;
          this.router.navigate(['hosts/view/' + this.host.id]);
        });
    }
    this.loading = false;
  }
}
