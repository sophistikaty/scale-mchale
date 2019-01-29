import { Component, OnInit } from '@angular/core';
import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  recipe: Recipe;

  getRecipe(id?: number): void {
    if (!id) {
      this.recipeService.getRecipes()
      .subscribe(recipes => {
        this.recipe = recipes.pop();
        console.log('home recipe ', this.recipe);
      });
      return;
    }
    this.recipeService.getRecipe(id)
    .subscribe(recipe => this.recipe = recipe);
  }

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    console.log('home init ', this);
    this.getRecipe();
  }

}
