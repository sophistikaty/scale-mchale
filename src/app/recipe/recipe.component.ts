import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  recipe: Recipe = {
    id: 2,
    name: 'tacos',
    ingredients: ['tortilla', 'steak', 'cheese']
  };
  constructor() { }

  ngOnInit() {
  }

}
