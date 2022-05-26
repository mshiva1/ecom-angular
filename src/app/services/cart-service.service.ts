import { Injectable } from '@angular/core';
import { GetProductService } from './get-product.service';

@Injectable()
export class CartServiceService {
  getCart(userId: string) {
    let localCart = localStorage.getItem("cart")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      return presentCart[userId];
    }
  }
  getQuantity(userId: string, productId: number) {
    let localCart = localStorage.getItem("cart")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      let initial: number = presentCart[userId][productId];
      if (initial == undefined) initial = 0;
      return initial;
    }
    return -1;
  }
  getTotalQuantity(userId: string) {
    let localCart = localStorage.getItem("cart")
    let currentUserTotal = 0;
    if (localCart != null) {
      let presentCart = JSON.parse(localCart);
      let currentUserCart: { [key: number]: number } = presentCart[userId];
      for (const key in currentUserCart) {
        currentUserTotal += currentUserCart[key];
      }
      return currentUserTotal;
    }
    return 0;
  }
  getTotalAmount(userId: string) {
    let localCart = localStorage.getItem("cart")
    let currentUserTotal = 0;
    if (localCart != null) {
      let presentCart = JSON.parse(localCart);
      let currentUserCart: { [key: number]: number } = presentCart[userId];
      for (const key in currentUserCart) {
        currentUserTotal += currentUserCart[key] * this.products_list.getProduct(key).price;
      }
      return currentUserTotal;
    }
    return 0;
  }
  incrementQuantity(userId: string, productId: number) {
    let localCart = localStorage.getItem("cart")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      let initial: number = presentCart[userId][productId];
      if (initial == undefined) initial = 0;
      presentCart[userId][productId] = initial + 1;
      localStorage.setItem("cart", JSON.stringify(presentCart));
      return initial + 1;
    }
    return 0;
  }
  decrementQuantity(userId: string, productId: number) {
    let localCart = localStorage.getItem("cart")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      let initial: number = presentCart[userId][productId];
      if (initial == undefined) initial = 0;
      if (initial <= 0) return -1;
      presentCart[userId][productId] = initial - 1;
      localStorage.setItem("cart", JSON.stringify(presentCart));
      return initial - 1;
    }
    return 0;
  }
  removeProduct(userId: string, productId: number) {
    let localCart = localStorage.getItem("cart")
    if (localCart != null) {
      let presentCart = JSON.parse(localCart)
      let initial: number = presentCart[userId][productId];
      if (initial == undefined) initial = 0;
      if (initial < 0) return -1;
      delete presentCart[userId][productId];
      localStorage.setItem("cart", JSON.stringify(presentCart));
      return 0;
    }
    return 0;
  }
  removeAll(userId: string) {
    let localCart = localStorage.getItem("cart")
    let currentUserTotal = 0;
    if (localCart != null) {
      let presentCart = JSON.parse(localCart);
      let currentUserCart: { [key: number]: number } = presentCart[userId];
      for (const key in currentUserCart) {
        currentUserCart[key] = 0;
      }
      presentCart[userId] = currentUserCart;
      localStorage.setItem("cart", JSON.stringify(presentCart));
    }
  }
  constructor(public products_list: GetProductService) { }
  //done
}
