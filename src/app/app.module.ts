import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NotifierModule } from 'angular-notifier';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CartServiceService } from './services/cart-service.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    UserModule,
    NgbModule,
    NgxSliderModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: "right",
          distance: 12
        },
        vertical: {
          position: "top",
          distance: 80
        }
      },
      behaviour: {
        autoHide: 0
      }

    })
  ],
  providers: [
    CartServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
