import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';

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
      .subscribe(recipes => this.recipe = recipes.pop());
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
