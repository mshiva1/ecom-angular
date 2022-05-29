import { Component, OnInit } from '@angular/core';
import { GetProductService } from 'src/app/services/get-product.service';
import { Papa } from 'ngx-papaparse';
import { NotifyService } from 'src/app/services/notify.service';
import { Title } from '@angular/platform-browser';
import { productData } from 'src/app/shared/models/product-data';
import { UploadDatatype } from 'src/app/shared/models/upload-data-type';
declare var $: any;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit {

  file = null;
  filename = "Choose File"
  dataPresent = false;
  displayData: UploadDatatype[] = [];
  error: string = "";
  errorFlag: boolean = false;
  total = {
    quantity: 0,
    price: 0
  }

  //when upload is clicked
  uploadData() {
    var config = {
      skipEmptyLines: true,
      header: true,
      complete: (results: any) => {
        this.loadDataintoTable(results)
      }
    }
    if (this.file) {
      this.papa.parse(this.file, config)
    }
  }
  //called parse completes
  loadDataintoTable(results: any) {
    if (
      !results.meta.fields.find(((field: string) => { return "ID" == field }))
      ||
      !results.meta.fields.find(((field: string) => { return "Quantity" == field }))
    ) {
      this.file = null;
      this.notify.notify("There are Errors in Uploaded file headers", "Error", 0, "error-in-upload");
      return;
    }
    var data = results.data
    var addedQuantityData: UploadDatatype[] = [];
    this.errorFlag = false;
    var errorsArray = [];
    for (let item of data) {
      var error;
      if (item.ID == "") {
        error = "ID is required"
      }
      else if (item.Quantity == "") {
        error = "Quantity is required"
      }
      else if (isNaN(parseInt(item.ID))) {
        error = "ID should be a number";
      }
      else if (isNaN(parseInt(item.Quantity))) {
        error = "Quantity should be a number";
      }
      else if (parseInt(item.Quantity) <= 0) {
        error = "Quantity should be positive"
      }
      else {
        error = "No error"
        var prev = addedQuantityData.find((prev_item: any) => { return prev_item["id"] == item.ID })
        if (prev)
          prev.quantity = prev.quantity + parseInt(item.Quantity)
        else {
          var current = this.products_list.getProduct(parseInt(item.ID))
          if (current.id == 0) {
            error = "Product ID is not found"
          }
          else
            addedQuantityData.push({
              id: parseInt(item.ID),
              img: current.img,
              name: current.name,
              price: current.price,
              quantity: parseInt(item.Quantity)
            })
        }
      }
      if (error != "No error")
        this.errorFlag = true;
      errorsArray.push({
        ID: item.ID,
        Quantity: item.Quantity,
        Error: error
      })
    }
    if (this.errorFlag) {
      this.dataPresent = false;
      this.file = null;
      this.downloadCsvFile(this.papa.unparse(errorsArray))
      this.notify.notify("Errors occured while Uploading", "Error", 0, "error-in-upload");
      //download Errors
    }
    else {
      this.displayData = addedQuantityData;
      this.setTotal();
      this.dataPresent = true;
      this.file = null;
      //display into table
    }
  }
  //download the CSV file
  downloadCsvFile(csvData: any) {
    var CSVFile = new Blob([csvData], {
      type: "text/csv"
    });
    var tempLink = document.createElement('a');
    tempLink.download = "Errors.csv";
    var url = window.URL.createObjectURL(CSVFile);
    tempLink.href = url;
    tempLink.style.display = "none";
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  }
  //sets the total quantity and total amount
  setTotal() {
    this.total.price = 0;
    this.total.quantity = 0;
    if (this.displayData.length)
      this.displayData.forEach((value: any) => {
        this.total.quantity += value.quantity
        this.total.price += value.price * value.quantity
      })
  }
  //called when the file is changed
  uploadFiles(file: any) {
    this.file = file.files[0];
  }

  constructor(public papa: Papa, public products_list: GetProductService, public notify: NotifyService, private title: Title) { }
  ngOnInit(): void {
    this.title.setTitle("Upload Order");
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }
  //done
}
