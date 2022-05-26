import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ValidateUserService } from 'src/app/services/validate-user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  logout() {
    this.validate.logoutUser()
  }
  constructor(public cart: CartServiceService, public validate: ValidateUserService, public router: Router) { }
  ngOnInit(): void {
    console.log(this.validate.checkCurrentUser())
    if ((!this.validate.checkCurrentUser()) && this.router.url != '/') {

      window.alert("User is logged out now. Please login again")
      this.router.navigate(['/login']);
    } console.log(this.router.url)
  }

  //done 
}
