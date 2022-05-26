import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import passwords from "src/assets/resources/json/passwords.json"

@Injectable({
  providedIn: 'root'
})
export class ValidateUserService {
  private currentPasswords = passwords;
  loginUser(username: string, password: string) {
    for (let item of this.currentPasswords) {
      if (item.username == username && item.password == password) {
        localStorage.setItem("currentUser", username)
        var presentCart = JSON.parse(localStorage.getItem("cart")!);
        if (presentCart[username] == undefined) {
          presentCart[username] = {};
          localStorage.setItem("cart", JSON.stringify(presentCart))
        }

        this.router.navigate(['/products'])
      }
    }
    return false;
  }
  logoutUser() {
    localStorage.removeItem("currentUser")
    this.router.navigate(['/login'])
  }

  checkCurrentUser() {
    let currentUser = localStorage.getItem("currentUser");
    if (currentUser == undefined)
      return false;
    for (let item of this.currentPasswords) {
      if (item.username == currentUser)
        return true;
    }
    return false;
  }
  getCurrentUser() {
    let currentUser = localStorage.getItem("currentUser");
    if (currentUser != undefined) {
      for (let item of this.currentPasswords) {
        if (item.username == currentUser)
          return item.username;
      }
    }
    //this.router.navigate(['/login'])
    return "";
  }
  constructor(private router: Router) { }
}
