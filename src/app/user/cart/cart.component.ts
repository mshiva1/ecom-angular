import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Papa } from 'ngx-papaparse';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { GetProductService } from 'src/app/services/get-product.service';
import { ValidateUserService } from 'src/app/services/validate-user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  UserId = this.validate.getCurrentUser();
  increment(productId: any) {
    this.cart.incrementQuantity(this.UserId, productId);
  }
  decrement(productId: any) {
    if (this.cart.getQuantity(this.UserId, productId) == 1)
      this.askConfirmRemove(productId)
    else
      this.cart.decrementQuantity(this.UserId, productId)

  }
  askConfirmRemove(productId: any) {
    this.removeProduct = {
      id: productId,
      name: this.products_list.getProduct(productId).name
    }
    this.openConfirmRemove(this.confirmRemove)
  }
  remove(productId: any) {
    this.cart.removeProduct(this.UserId, productId)
  }
  askConfirmClear() {
    this.openConfirmClear(this.confirmClear)
  }
  clearCart() {
    this.cart.removeAll(this.UserId)
  }
  //called when order cofirms
  checkOut() {
    var cart = this.cart.getCart(this.UserId)
    var csvdata = []
    for (let item in cart) {
      if (cart[item] > 0) {
        var product = this.products_list.getProduct(item)
        csvdata.push({
          "ID": item,
          "Name": product["name"],
          "Price": product["price"],
          "Quantity": cart[item]
        });
      }
    }
    this.downloadCsvFile(this.papa.unparse(csvdata))
    this.openCheckoutSuccess(this.checkOutSuccess)
    this.cart.removeAll(this.UserId)
  }
  //downloads csv file while checkout
  downloadCsvFile(csvData: any) {
    var CSVFile = new Blob([csvData], {
      type: "text/csv"
    });
    var tempLink = document.createElement('a');
    tempLink.download = "Order.csv";
    var url = window.URL.createObjectURL(CSVFile);
    tempLink.href = url;
    tempLink.style.display = "none";
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }

  //modals --confirm removing one product
  removeProduct = {
    id: 0,
    name: ""
  }
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
      this.remove(this.removeProduct.id)
  }

  //modal for clearing cart
  @ViewChild('confirmClear')
  confirmClear!: NgModel;
  openConfirmClear(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.getConfirmClear(result);
    }, (reason) => {
      this.getConfirmClear(reason);
    });
  }
  private getConfirmClear(reason: any): void {
    if (reason == "confirm")
      this.clearCart()
  }

  //modal for cart checkout
  @ViewChild('checkOutSuccess')
  checkOutSuccess!: NgModel;
  openCheckoutSuccess(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  constructor(public cart: CartServiceService, public products_list: GetProductService, public papa: Papa, private modalService: NgbModal, private validate: ValidateUserService) { }
  ngOnInit(): void {
  }
  //done
}
