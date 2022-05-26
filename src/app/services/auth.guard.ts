import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidateUserService } from './validate-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    var isAuthenicated = false;
    isAuthenicated = this.validate.checkCurrentUser()
    if (!isAuthenicated)
      this.router.navigate(['/login']);
    return isAuthenicated;
  }
  constructor(private router: Router, private validate: ValidateUserService) { }
}
