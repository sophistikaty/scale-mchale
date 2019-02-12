import { Component, OnInit } from '@angular/core';
import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  mockRecipes: Recipe[];

  public myRecipes = JSON.parse(sessionStorage.getItem('recipes')) || {};
  public hasRecipes = Object.keys(this.myRecipes).length > 0;
  public recipe: Recipe = Object.keys(this.myRecipes)[0] ? this.myRecipes[ Object.keys(this.myRecipes)[0] ] : {};
  private visibleIndex: number;

  getRecipes(): void {
    this.recipeService.getRecipes()
      .subscribe(recipes => this.mockRecipes = recipes);
  }

  setupRecipe() {
    const { ingredients = []} = this.recipe;
    for (const ingredient of ingredients) {
      console.log('ingredient ', ingredient);
      let { quantity, text } = ingredient;
      // quantity = getIngredientQuantity(ingredient);
			// let {food, measure, prevQuantity, prevMeas } = ingredient; 
			// measure = getIngredientMeasure(ingredient);
			// food = text.split(measure).pop();

			// prevQuantity = quantity;
			// prevMeas = measure;
		}
  }

  selectRecipe(recipe: Recipe): void {
    if (recipe.id) {
      this.visibleIndex = recipe.id;
    }

		this.recipe = recipe;
		this.setupRecipe();
  }

  constructor(private recipeService: RecipeService) { }
  ngOnInit() {
    // this.getRecipes();
    this.setupRecipe();

  }

}
