import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
// import { Observable } from 'rxjs';

import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  // recipe$: Observable<Recipe>;
  recipe: Recipe;

  updateVal(val) {
    console.log('val', val);
    this.recipe = val;
  }

  getRecipe(): void {
    const id: string = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(id)
    .subscribe(this.updateVal);
  }

  goBack(): void {
    this.location.back();
  }

  save(recipe: Recipe): void {
    this.recipeService.updateRecipe(recipe);
      // .subscribe(() => this.goBack());
  }

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location) { }

  ngOnInit() {
    this.getRecipe();
  }

}
