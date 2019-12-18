import { AngularMaterialModule } from "./angular-material.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { appRoutingModule } from "./app.routing";
import { ItemListComponent } from "./item/item-list/item-list.component";
import { ItemAddComponent } from "./item/item-add/item-add.component";
import { ToastrModule } from "ngx-toastr";
import { EnumToArrayPipe } from "./_pipes/enum-to-array.pipe";
import { PlaceListComponent } from './place/place-list/place-list.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { PlaceViewComponent } from './place/place-view/place-view.component';
import { RentalListChildComponent } from './rental/rental-list-child/rental-list-child.component';
import { RenterListComponent } from './renter/renter-list/renter-list.component';
import { RenterViewComponent } from './renter/renter-view/renter-view.component';
import { ItemViewComponent } from './item/item-view/item-view.component';
import { RentalAddComponent } from './rental/rental-add/rental-add.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { RenterFormComponent } from './renter/renter-form/renter-form.component';
import { PlaceFormComponent } from './place/place-form/place-form.component';
import { HostListComponent } from './host/host-list/host-list.component';
import { HostViewComponent } from './host/host-view/host-view.component';
import { HostFormComponent } from './host/host-form/host-form.component';
import { ConnectionInterfaceFormComponent } from './connection-interface/connection-interface-form/connection-interface-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ItemListComponent,
    ItemAddComponent,
    EnumToArrayPipe,
    PlaceListComponent,
    PlaceViewComponent,
    RentalListChildComponent,
    RenterListComponent,
    RenterViewComponent,
    ItemViewComponent,
    RentalAddComponent,
    ConfirmationDialogComponent,
    RenterFormComponent,
    PlaceFormComponent,
    HostListComponent,
    HostViewComponent,
    HostFormComponent,
    ConnectionInterfaceFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
