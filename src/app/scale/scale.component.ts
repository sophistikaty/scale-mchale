import { Component, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Recipe } from '../types/recipe';

import { ConversionService } from '../core/services/conversion.service';
import { RecipeService } from '../core/services/recipe.service';
import { NutritionService } from '../core/services/nutrition.service';
import { Ingredient } from '../types/ingredient';

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['./scale.component.scss']
})

export class ScaleComponent implements OnInit {
data;

 conversions: object;
 conversionsArr: Array<object>;

 getConversions(): void {
  const component = this;
  this.conversions = this.conversionService.getConversions();
  this.conversionsArr = Object.keys(this.conversions).map(function(measName: string) {
    return component.conversions[measName];
  });
}

getIndexFromEvent(e: Event): number {
  const elementId = e.srcElement.id;
  const idStr = elementId.split('-').pop();
  return this.recipeService.getIngredientQuantity(idStr);
}

onQuantityChanged( newRecipe: Recipe, e: Event) {
  const ingredientIndex = this.getIndexFromEvent(e);
  this.conversionService.quantityChanged(this.data.recipe, ingredientIndex);
}

private initQuantityObservers(newRecipe: Recipe) {
  const quantityInputs = document.querySelectorAll('input.quantity');
  if (!quantityInputs || !quantityInputs.length) {
    return;
  }
  fromEvent(quantityInputs, 'keyup')
  .pipe(debounceTime(500), distinctUntilChanged(),
    map((e) => this.onQuantityChanged(newRecipe, e)))
  .subscribe();
}

onMeasurementChanged(ingredient: Ingredient) {
  this.conversionService.convertMeasurement(ingredient);
}

  constructor(private conversionService: ConversionService,
              private recipeService: RecipeService,
              public nutritionService: NutritionService) {}

  ngOnInit() {
    this.getConversions();
    //TODO: fix timing of quantity observer init
    this.recipeService.selectedRecipe$.subscribe(val => this.initQuantityObservers(val));
    console.log('nutrition info', this.nutritionService.nutriitonInfo);
  }
}
