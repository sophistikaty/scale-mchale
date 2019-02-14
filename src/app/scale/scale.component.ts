import { Component, OnInit, Input } from '@angular/core';
import { Scale } from '../types/scale';
import { Recipe } from '../types/recipe';

import { ConversionService } from '../core/services/conversion.service';
import { RecipeService } from '../core/services/recipe.service';
import { NutritionService } from '../core/services/nutrition.service';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})

export class ScaleComponent implements OnInit {
@Input() selectedRecipe: Recipe;
// selectedRecipe: Recipe;

 scale: Scale = {
   id: 2,
   name: 'juicy pears'
 };

 conversions: object;
 conversionsArr: Array<object>;
 recipes: Recipe[];

 onSelect(recipe: Recipe): void {
   this.selectedRecipe = recipe;
 }

 getConversions(): void {
  const component = this;
  this.conversions = this.conversionService.getConversions();
  this.conversionsArr = Object.keys(this.conversions).map(function(measName: string) {
    return component.conversions[measName];
  });
}

getRecipes(): void {
  this.recipeService.getRecipes()
    .subscribe(recipes => {
      this.recipes = recipes;
      this.selectedRecipe =  this.selectedRecipe || recipes.pop();
      console.log('selected recipe in scale ', this.selectedRecipe);
    });
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
