import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {
  recipe$: Observable<Recipe>;

  goBack(): void {
    this.location.back();
  }

  save(recipe: Recipe): void {
    this.recipeService.updateRecipe(recipe);
  }

  init(): void {
    const id: string = this.route.snapshot.paramMap.get('id');
    this.recipe$ = this.recipeService.getRecipe(id);
  }

  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location) { }

  ngOnInit() {
    this.init();
  }

}
