import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  @Input() myRecipes: Recipe[];
  @Input() hasRecipes: boolean;

  selectRecipe(recipe: Recipe): void {
    this.recipeService.setSelectedRecipe(recipe);
  }

  deleteRecipe(recipe: Recipe){
    const recipeLib = JSON.parse(sessionStorage.getItem('recipes')) || {};
    delete recipeLib[recipe.id];
    this.recipeService.updateSavedRecipes(recipeLib);
  }

  constructor(private recipeService: RecipeService) { }
  ngOnInit() {}
}
