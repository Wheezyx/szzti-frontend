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
    canActivate: [AuthGuard]
  },
  {
    path: "secured",
    component: SecuredComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] }
  },
  {
    path: "items",
    component: ItemListComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "items/add",
    component: ItemAddComponent
  },
  {
    path: "places",
    component: PlaceListComponent
  },
  {
    path: "places/view/:id",
    component:  PlaceViewComponent
  },
  //TODO Change to 404 error page
  { path: "**", redirectTo: "" }
];

export const appRoutingModule = RouterModule.forRoot(routes);
