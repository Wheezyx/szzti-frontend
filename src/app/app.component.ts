import { AuthenticationService } from "./_services/authentication.service";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { fadeInAnimation } from './_animations/fade-in-animation';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [fadeInAnimation]
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
