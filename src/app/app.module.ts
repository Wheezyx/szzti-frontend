import { AngularMaterialModule } from "./angular-material.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeComponent } from "./home/home.component";
import { SecuredComponent } from "./secured/secured.component";
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SecuredComponent,
    LoginComponent,
    ItemListComponent,
    ItemAddComponent,
    EnumToArrayPipe,
    PlaceListComponent
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
