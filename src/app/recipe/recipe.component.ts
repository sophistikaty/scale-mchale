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

  // setupRecipe() {
  //   const { ingredients = []} = this.recipe;
  //   for (const ingredient of ingredients) {
  //     console.log('ingredient ', ingredient);
  //     let { quantity, prevQuantity, measure, prevMeasure, food, text } = ingredient;
  // 	}
  // }

  selectRecipe(recipe: Recipe): void {
    this.recipeService.setSelectedRecipe(recipe);

    // if (recipe.id) {
    //   this.visibleIndex = recipe.id;
    // }
    // this.setupRecipe();
  }

  constructor(private recipeService: RecipeService) { }
  ngOnInit() {
    // this.getRecipes();
    // this.setupRecipe();

  }

}
