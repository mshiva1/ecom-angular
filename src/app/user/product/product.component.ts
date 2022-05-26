import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { GetProductService } from 'src/app/services/get-product.service';
import { GetRatingHtmlService } from 'src/app/services/get-rating-html.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';
import { ValidateUserService } from 'src/app/services/validate-user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {


  UserId = this.validate.getCurrentUser();
  productId = 0;
  product = this.products_list.getProduct(this.productId);
  increment(productId: any) {
    this.cart.incrementQuantity(this.UserId, productId)
  }
  decrement(productId: any) {
    if (this.cart.getQuantity(this.UserId, productId) == 1) {
      this.askConfirmRemove(productId)
    }
    else
      this.cart.decrementQuantity(this.UserId, productId)
  }
  remove(productId: any) {
    this.cart.removeProduct(this.UserId, this.productId)
  }
  askConfirmRemove(productId: any) {
    this.openConfirmRemove(this.confirmRemove)
  }

  //modal
  @ViewChild('confirmRemove')
  confirmRemove!: NgModel;
  openConfirmRemove(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.getConfirmRemove(result);
    }, (reason) => {
      this.getConfirmRemove(reason);
    });
  }

  private getConfirmRemove(reason: any): void {
    if (reason == "confirm")
      this.remove(this.productId)
  }
  constructor(private route: ActivatedRoute, public products_list: GetProductService, public ratingService: GetRatingHtmlService, public cart: CartServiceService, private modalService: NgbModal, private validate: ValidateUserService) {
    this.route.queryParams
      .subscribe(params => {
        this.productId = params['id']
        this.product = this.products_list.getProduct(this.productId)
      }
      )
  }
  ngOnInit(): void {
  }
  //done
}
