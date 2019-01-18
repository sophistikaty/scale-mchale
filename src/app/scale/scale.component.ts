import { Component, OnInit } from '@angular/core';
import { Scale } from '../scale';
import { Recipe } from '../recipe';

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

 selectedRecipe: Recipe = this.mockRecipes[0];
 onSelect(recipe: Recipe): void {
   this.selectedRecipe = recipe;
 }

  constructor() { }

  ngOnInit() {
  }

}
