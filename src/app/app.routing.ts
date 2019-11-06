import { AuthGuard } from "./helpers/auth_guard";
import { LoginComponent } from "./login/login.component";
import { SecuredComponent } from "./secured/secured.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { Role } from "./models/role";

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
    path: "login",
    component: LoginComponent
  },
  //TODO Change to 404 error page
  { path: "**", redirectTo: "" }
];

export const appRoutingModule = RouterModule.forRoot(routes);
