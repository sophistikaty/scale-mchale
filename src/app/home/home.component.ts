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

  recipe: Recipe;
  myRecipes$: Observer<Recipe>;

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
    this.recipe = this.recipeService.getSelectedRecipe();
    this.myRecipes$ = {
      next: x => console.log('Observer got a next value: ' + x),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };

    this.recipeService.recipes$.subscribe(this.myRecipes$);
  }
}
