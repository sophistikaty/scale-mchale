import { Component, OnInit, Input } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Scale } from '../types/scale';
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
@Input() selectedRecipe: Recipe;

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
  const quantityInputs = document.querySelectorAll('input.quantity');
  if (!quantityInputs || !quantityInputs.length) {
    return;
  }
  fromEvent(quantityInputs, 'keyup')
  .pipe(debounceTime(500), distinctUntilChanged(),
    map((e) => this.onQuantityChanged(e)))
  .subscribe();
}

onMeasurementChanged(ingredient: Ingredient) {
  this.conversionService.convertMeasurement(ingredient);
}

  constructor(private conversionService: ConversionService,
              private recipeService: RecipeService,
              public nutritionService: NutritionService) { }

  ngOnInit() {
    this.getConversions();
    this.initQuantityObservers();
    console.log('nutrition info', this.nutritionService.nutriitonInfo);
  }
}
