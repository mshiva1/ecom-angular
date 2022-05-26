import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateUserService } from './services/validate-user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'trial2';
  constructor(public validate: ValidateUserService, public router: Router) { }
  ngOnInit() {
  }

}
