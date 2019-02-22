import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  getRecipe(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(id)
      .subscribe(recipe => this.recipe = recipe);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.recipeService.updateRecipe(this.recipe)
      .subscribe(() => this.goBack());
  }

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location) { }

  ngOnInit() {
    this.getRecipe();
    console.log('recipe', this.recipe);
  }

}
