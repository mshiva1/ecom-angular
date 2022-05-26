import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UploadComponent } from './upload/upload.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    CartComponent,
    ProductsComponent,
    ProductComponent,
    UploadComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxSliderModule,
  ],
})
export class UserModule { }
