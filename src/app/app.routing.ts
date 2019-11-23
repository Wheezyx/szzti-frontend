import { RenterFormComponent } from './renter/renter-form/renter-form.component';
import { RentalAddComponent } from './rental/rental-add/rental-add.component';
import { ItemViewComponent } from './item/item-view/item-view.component';
import { RenterViewComponent } from './renter/renter-view/renter-view.component';
import { RenterListComponent } from './renter/renter-list/renter-list.component';
import { RentalListChildComponent } from './rental/rental-list-child/rental-list-child.component';
import { PlaceViewComponent } from './place/place-view/place-view.component';
import { PlaceListComponent } from './place/place-list/place-list.component';
import { ItemListComponent } from "./item/item-list/item-list.component";
import { LoginComponent } from "./login/login.component";
import { SecuredComponent } from "./secured/secured.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { Role } from "./_models/role";
import { ItemAddComponent } from './item/item-add/item-add.component';
import { AuthGuard } from './_helpers/auth_guard';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "secured",
    component: SecuredComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: "items",
    component: ItemListComponent,
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "items/add",
    component: ItemAddComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
    
  },
  {
    path: "places",
    component: PlaceListComponent
  },
  {
    path: "places/view/:id",
    component:  PlaceViewComponent
  },
  {
    path: "renters",
    component: RenterListComponent
  },
  {
    path: "renters/view/:id",
    component:  RenterViewComponent
  },
  {
    path: "items/view/:id",
    component:  ItemViewComponent
  },
  {
    path: "renters/edit/:id",
    component: RenterFormComponent
  },
  {
    path: "renters/add",
    component: RenterFormComponent
  },
  {
    path: "rentals/add",
    component: RentalAddComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  //TODO Change to 404 error page
  { path: "**", redirectTo: "" }
];

export const appRoutingModule = RouterModule.forRoot(routes);
