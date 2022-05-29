import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ValidateUserService } from 'src/app/services/validate-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  wrong_cred = false;
  login() {
    let isValid = this.validate.loginUser(this.username, this.password)
    if (!isValid)
      this.wrong_cred = !this.wrong_cred;
  }
  constructor(private router: Router, private validate: ValidateUserService, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("Login");
    if (this.validate.checkCurrentUser())
      this.router.navigate(['/products']);
  }

}
