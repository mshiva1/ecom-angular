import { Component, OnInit, ViewChild } from '@angular/core';
import { GetRatingHtmlService } from 'src/app/services/get-rating-html.service';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { GetProductService } from 'src/app/services/get-product.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidateUserService } from 'src/app/services/validate-user.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    UserId = this.validate.getCurrentUser();
    filterpopup = false || window.matchMedia('(min-width: 992px)').matches;
    filterpopback = this.filterpopup && window.matchMedia('(max-width: 991px)').matches;
    toogle() {
        this.filterpopback = !this.filterpopback
        this.filterpopup = !this.filterpopup || window.matchMedia('(min-width: 992px)').matches;
    }
    /*Sort Methods and current Sorting Method*/
    currentSortMethod = "Rating";
    SortMethods = [
        "Rating",
        "Low to High",
        "High to Low"
    ];
    uncheckedAll = true;
    setUnchecked() {
        for (let item of this.filterBrands) {
            if (item.checked)
                return false
        }
        return true;
    }
    sort() {
        if (this.currentSortMethod == "Low to High") this.displayProducts.sort((a, b) => a.price - b.price)
        else if (this.currentSortMethod == "High to Low") this.displayProducts.sort((a, b) => b.price - a.price)
        else this.displayProducts.sort((a, b) => b.rating - a.rating)
    }

    /*currently showing products*/
    currentProducts = this.products_list.getAllProducts()
    displayProducts = this.products_list.getAllProducts()
    /*filters */
    filterBrands: any;
    filterRating = 0;

    initAllBrands(all_products: any[]) {
        var allBrandsSet = new Set();
        all_products.forEach((element) => {
            if (element.price > this.ceil) this.ceil = element.price
            allBrandsSet.add(element["brand"]);
        })
        this.filterBrands = [];
        allBrandsSet.forEach((element) => {
            this.filterBrands.push({
                brandName: element,
                checked: false     //this checked gets updated when user checks or unchecks brand boxes
            });
        })
        this.options.ceil = this.ceil
        this.maxValue = this.ceil
    }

    setRating(rating: number) {
        this.filterRating = rating;
        this.filter()
    }

    filter() {
        this.uncheckedAll = this.setUnchecked()
        this.displayProducts = []
        this.currentProducts.forEach((element) => {
            if (
                //brands check
                (this.uncheckedAll || this.filterBrands.find((brand: any) => { return brand["brandName"] == element["brand"] })["checked"]) &&
                //check for min rating
                element.rating >= this.filterRating
                &&
                //check for price filter
                element.price >= this.minValue && element.price <= this.maxValue
            )
                this.displayProducts.push(element)
        });
        this.sort()
    }

    resetFilters() {
        this.filterBrands.forEach((element: any) => { element["checked"] = false });
        this.filterRating = 0;
        this.minValue = this.floor;
        this.maxValue = this.ceil;
        this.filter()
    }
    removeSpecificFilter(filter: string) {
        if (filter == "rating")
            this.filterRating = 0;
        else if (filter == "brands")
            this.filterBrands.forEach((element: any) => { element["checked"] = false });
        else if (filter == "price") {
            this.minValue = this.floor;
            this.maxValue = this.ceil;
        }
        this.filter();
        this.sort();
    }

    ceil = 0;
    floor = 0;
    options: Options = {
        boundPointerLabels: true,
        hidePointerLabels: true,
        hideLimitLabels: true,
        floor: this.floor,
        ceil: this.ceil,
        step: 1,
        enforceStep: false,
        enforceRange: false,
    };
    minValue: number = this.floor;
    maxValue: number = this.ceil;

    sliderChanged() {
        this.filter()
    }
    errorFun() {
    }

    /*basic functions */
    getHTMLRating(rating: Number) {
        return this.user.getHtmlForRating(rating);
    }
    increment(ProductId: number) {
        this.cart.incrementQuantity(this.UserId, ProductId);
    }
    decrement(ProductId: number) {
        if (this.cart.getQuantity(this.UserId, ProductId) == 1)
            this.askConfirmRemove(ProductId)
        else
            this.cart.decrementQuantity(this.UserId, ProductId);
    }
    remove(ProductId: number) {
        this.cart.removeProduct(this.UserId, ProductId)
    }
    askConfirmRemove(ProductId: number) {
        this.removeProduct = {
            id: ProductId,
            name: this.products_list.getProduct(ProductId).name
        }
        this.openConfirmRemove(this.confirmRemove)
    }
    removeProduct = {
        id: 0,
        name: ""
    }
    //modal for confirmation on removal
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

    constructor(private user: GetRatingHtmlService, public cart: CartServiceService, public products_list: GetProductService, private modalService: NgbModal, private validate: ValidateUserService) {
    }
    ngOnInit(): void {
        this.sort()
        this.initAllBrands(this.currentProducts)

    }
    //TODO : optimize , filter for price, 0-checkbox filter for brands, (filter,sort) retain
}
