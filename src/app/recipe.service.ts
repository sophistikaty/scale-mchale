import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Recipe } from './recipe';
import { NutritionService } from './nutrition.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  mockRecipes: Recipe[] = [
    {
      id: 2,
      name: 'gyro',
      ingredients: ['beef', 'pita', 'cheese', 'lettuce']
    },
    {
      id: 3,
      name: '333 tacos',
      ingredients: ['tortilla', 'steak', '3 cheese']
    },
    {
      id: 4,
      name: 'delicious pizza',
      ingredients: ['dough', 'tomato sauce', 'cheese']
    }
   ];

   getRecipe(id: number): Observable<Recipe> {
    return of(this.mockRecipes.find(recipe => recipe.id === id));
  }
  getRecipes(): Observable<Recipe[]> {
    console.log('adding recipe');
    this.nutritionService.add('mock nutrition from recipe');
    return of(this.mockRecipes);
  }

  constructor(private nutritionService: NutritionService) { }
}
