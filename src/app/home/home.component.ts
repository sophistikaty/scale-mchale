import { Component, OnInit } from '@angular/core';
import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  selectedRecipe: Recipe;
  myRecipes: Recipe[];
  hasRecipes: boolean;

  updateSelectedRecipe(recipe:Recipe) {
    this.selectedRecipe = recipe;
  }

  cardboxUpdated(recipeArr: Recipe[]) {
    this.myRecipes = recipeArr;
    this.hasRecipes = Object.keys(this.myRecipes).length > 0;
  }

  myRecipes$: Observer<Recipe[]> = {
    next: recipeArr => this.cardboxUpdated(recipeArr),
    error: err => console.error('Observer got an error: ' + err),
    complete: () => console.log('Observer got a complete notification'),
  };

  selectedRecipe$: Observer<Recipe> = {
    next: recipe => this.updateSelectedRecipe(recipe),
    error: err => console.error('Observer got an error: ' + err),
    complete: () => console.log('Observer got a complete notification'),
  };

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {

    this.recipeService.recipes$.subscribe(this.myRecipes$);
    this.recipeService.selectedRecipe$.subscribe(this.selectedRecipe$);
  }
}
