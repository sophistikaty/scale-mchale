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

  public myRecipes: object;
  public hasRecipes: boolean;
  public recipe: Recipe;

  getRecipes(): void {
    this.recipeService.getRecipes()
      .subscribe(recipes => this.mockRecipes = recipes);
  }

  setupRecipes() {
    this.myRecipes = JSON.parse(sessionStorage.getItem('recipes')) || {};
    this.hasRecipes = Object.keys(this.myRecipes).length > 0;
    this.recipe = this.recipeService.getSelectedRecipe();
  }

  selectRecipe(recipe: Recipe): void {
    this.recipeService.setSelectedRecipe(recipe);
    //use observer for changes to service set record
    this.recipe = recipe;
  }

  deleteRecipe(recipe: Recipe){
    const recipeLib = JSON.parse(sessionStorage.getItem('recipes')) || {};
    delete recipeLib[recipe.id];
    this.recipeService.updateSavedRecipes(recipeLib);
    this.setupRecipes();
  }

  constructor(private recipeService: RecipeService) { }
  ngOnInit() {
    // this.getRecipes();
    this.setupRecipes();

  }

}
