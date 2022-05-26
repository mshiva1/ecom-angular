import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetRatingHtmlService {

  getHtmlForRating(rating: Number) {
    var str = '<span class="no-break">';
    for (let i = 1; i <= 5; i++)
      if (i <= rating)
        str += this.getDark()
      else
        str += this.getLight()
    return str + "</span>";
  }

  //get light star
  getLight() {
    return '<span class="material-icons-outlined icon-normal star-color">star_border</span>';
  }

  //get dark star
  getDark() {
    return '<span class="material-icons-outlined icon-normal star-color">star</span>';
  }
  constructor() { }
  //done
}
