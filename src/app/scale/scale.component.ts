import { Component, OnInit } from '@angular/core';
import { Scale } from '../scale';
import { Recipe } from '../recipe';

import { ConversionService } from '../conversion.service';
import { RecipeService } from '../recipe.service';
import { NutritionService } from '../nutrition.service';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})
export class ScaleComponent implements OnInit {
 scale: Scale = {
   id: 2,
   name: 'juicy pears'
 };

 conversions: object;
 recipes: Recipe[];

 selectedRecipe: Recipe;
 onSelect(recipe: Recipe): void {
   this.selectedRecipe = recipe;
 }

 getConversions(): void {
  this.conversions = this.conversionService.getConversions();
  console.log(this.conversions);
}

getRecipes(): void {
  this.recipeService.getRecipes()
    .subscribe(recipes => this.recipes = recipes);
}

  constructor(private conversionService: ConversionService, 
              private recipeService: RecipeService,
              public nutritionService: NutritionService) { }

  ngOnInit() {
    this.getConversions();
    this.getRecipes();
    console.log('nutrition info', this.nutritionService.nutriitonInfo);
  }

}
