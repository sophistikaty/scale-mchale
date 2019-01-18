import { Component, OnInit } from '@angular/core';
import { Scale } from '../scale';
import { Recipe } from '../recipe';

import { ConversionService } from '../conversion.service';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})
export class ScaleComponent implements OnInit {
 scale: Scale = {
   id: 2,
   name: 'juicy pears'
 };

 conversions: object;

 mockRecipes: Recipe[] = [
  {
    id: 3,
    name: '3 tacos',
    ingredients: ['tortilla', 'steak', '3 cheese']
  },
  {
    id: 4,
    name: 'pizza',
    ingredients: ['dough', 'tomato sauce', 'cheese']
  }
 ];

 selectedRecipe: Recipe;
 onSelect(recipe: Recipe): void {
   this.selectedRecipe = recipe;
 }

 getConversions(): void {
  this.conversions = this.conversionService.getConversions();
  console.log(this.conversions);
}

  constructor(private conversionService: ConversionService) { }

  ngOnInit() {
    this.getConversions();
  }

}
