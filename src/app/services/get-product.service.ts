import { Injectable } from '@angular/core';
import products from "src/assets/resources/json/products.json";
import { productData } from '../shared/models/product-data';

@Injectable({
  providedIn: 'root'
})
export class GetProductService {

  products_list = products;
  //gets all products
  getAllProducts(): productData[] {
    return this.products_list;
  }
  //gets specific product
  getProduct(ProductId: any): productData {
    for (let item of this.products_list) {
      if (item.id == ProductId)
        return item;
    }
    return {
      "id": 0,
      "brand": "",
      "name": "",
      "img": "",
      "price": 0,
      "description": "",
      "rating": 0
    };
  }
  constructor() { }
  //done
}
