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

  getRecipes(): void {
    this.recipeService.getRecipes()
      .subscribe(recipes => this.mockRecipes = recipes);
  }

  constructor(private recipeService: RecipeService) { }
  ngOnInit() {
    this.getRecipes();
  }

}
