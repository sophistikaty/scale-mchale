import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  nutriitonInfo: string[] = [];

  add(nutriiton: string) {
    console.log('adding nutrition ', nutriiton);
    this.nutriitonInfo.push(nutriiton);
  }

  clear() {
    this.nutriitonInfo = [];
  }

  constructor() { }
}
