import { Component, OnInit, ViewChild } from '@angular/core';
import { GetRatingHtmlService } from 'src/app/services/get-rating-html.service';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { GetProductService } from 'src/app/services/get-product.service';
import { Options } from '@angular-slider/ngx-slider';
import { NgModel } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidateUserService } from 'src/app/services/validate-user.service';
import { Title } from '@angular/platform-browser';
import { productData } from 'src/app/shared/models/product-data';
declare var $: any;
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
    currentSortMethod: string = "Rating"; //initial sort method is rating
    SortMethods: string[] = [
        "Rating",
        "Low to High",
        "High to Low"
    ];
    sort() {
        if (this.currentSortMethod == "Low to High") this.displayProducts.sort((a, b) => a.price - b.price)
        else if (this.currentSortMethod == "High to Low") this.displayProducts.sort((a, b) => b.price - a.price)
        else this.displayProducts.sort((a, b) => b.rating - a.rating)
    }

    //filters

    currentProducts: productData[] = this.products_list.getAllProducts()

    /*currently showing products*/
    displayProducts: productData[] = this.products_list.getAllProducts()

    /*filters */
    changeCheckBrand(brandName: string, checkValue: any) {
        if (checkValue)
            this.checkedBrands.add(brandName)
        else
            this.checkedBrands.delete(brandName)
        this.filter()
    }

    checkedBrands: Set<string> = new Set;
    allBrands: any[] = [];
    filterRating: number = 0;

    ceil: number = 0;
    floor: number = 0;
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


    //initiate filters 
    initFilters(all_products: any[]) {
        var allBrandsSet = new Set();
        all_products.forEach((element) => {
            if (element.price > this.ceil) this.ceil = element.price
            allBrandsSet.add(element["brand"]);
        })
        this.allBrands = Array.from(allBrandsSet)
        this.options.ceil = this.ceil
        this.maxValue = this.ceil
    }
    //set filter rating to 'rating'
    setRating(rating: number) {
        this.filterRating = rating;
        this.filter()
    }

    //filters all products based on curent filter data
    filter() {
        this.displayProducts = []
        this.currentProducts.forEach((element) => {
            if (
                //brands check
                (!this.checkedBrands.size ||
                    this.checkedBrands.has(element.brand))
                &&
                //check for min rating
                element.rating >= this.filterRating
                &&
                //check for price filter
                element.price >= this.minValue && element.price <= this.maxValue
            )
                this.displayProducts.push(element)
        });
        this.sort();
        var filterObject = {
            brands: "",
            priceMin: 0,
            priceMax: 0,
            rating: 0
        }

        if (1
        ) {
            filterObject.brands = JSON.stringify(Array.from(this.checkedBrands))
            filterObject.priceMax = this.maxValue
            filterObject.priceMin = this.minValue
            filterObject.rating = this.filterRating
            sessionStorage.setItem("filters", JSON.stringify(filterObject))
        }
        console.log(filterObject)

    }

    resetFilters() {
        this.checkedBrands = new Set;
        this.filterRating = 0;
        this.minValue = this.floor;
        this.maxValue = this.ceil;
        this.filter()
    }
    removeSpecificFilter(filter: string) {
        if (filter == "rating")
            this.filterRating = 0;
        else if (filter == "brands")
            this.checkedBrands = new Set;
        else if (filter == "price") {
            this.minValue = this.floor;
            this.maxValue = this.ceil;
        }
        this.filter();
        this.sort();
    }
    //function called when slider is changed
    sliderChanged() {
        this.filter()
    }
    errorFun() { }
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

    //confimrmation data
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
    checkLocalStorageForFilters() {
        var prevFilter = sessionStorage.getItem("filters")
        if (prevFilter == null) {
            this.minValue = 0;
            this.maxValue = this.ceil;
            this.checkedBrands = new Set()
            this.filterRating = 0;
            return;
        }
        var filters = JSON.parse(prevFilter);
        console.log(filters)
        this.maxValue = filters.priceMax;
        this.minValue = filters.priceMin;
        this.checkedBrands = new Set(JSON.parse(filters.brands));
        this.setRating(filters.rating)
        console.log(this.minValue, this.maxValue)
        this.filter()
    }


    constructor(private user: GetRatingHtmlService, public cart: CartServiceService, public products_list: GetProductService, private modalService: NgbModal, private validate: ValidateUserService, private title: Title) {
    }
    ngOnInit(): void {
        this.title.setTitle("Products");
        this.initFilters(this.currentProducts);
        this.checkLocalStorageForFilters();
        this.sort()
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }
    //TODO  (filter,sort) retain refresh
}
