import { Component, OnInit, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
      this.initQuantityObservers();
    });
}

getIndexFromEvent(e: Event): number {
  const elementId = e.srcElement.id;
  const idStr = elementId.split('-').pop();
  return this.recipeService.getIngredientQuantity(idStr);
}

onQuantityChanged( e: Event) {
  const ingredientIndex = this.getIndexFromEvent(e);
  this.conversionService.quantityChanged(this.selectedRecipe, ingredientIndex);
}

private initQuantityObservers() {
  fromEvent(document.querySelectorAll('input.quantity'), 'keyup')
  .pipe(debounceTime(500), distinctUntilChanged(),
    map((e) => this.onQuantityChanged(e)))
  .subscribe();
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
