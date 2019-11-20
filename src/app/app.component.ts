import { AuthenticationService } from "./_services/authentication.service";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "./_models/user";
import { Role } from "./_models/role";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  get isAdmin() {
    return this.authenticationService.isAdmin();
  }

  get isLogged() {
    return this.authenticationService.isLogged();
  }
}
