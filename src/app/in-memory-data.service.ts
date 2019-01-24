import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Recipe } from './recipe';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  private recipesUrl = 'api/recipes';  // URL to web api

  createDb() {
    const recipes = [
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
      },
      { id: 11, name: 'Mr. Nice', ingredients: [] },
      { id: 12, name: 'Narco', ingredients: [] },
      { id: 13, name: 'Bombasto', ingredients: [] },
      { id: 14, name: 'Celeritas', ingredients: [] },
      { id: 15, name: 'Magneta', ingredients: [] },
      { id: 16, name: 'RubberMan', ingredients: [] },
      { id: 17, name: 'Dynama', ingredients: [] },
      { id: 18, name: 'Dr IQ', ingredients: [] },
      { id: 19, name: 'Magma', ingredients: [] },
      { id: 20, name: 'Tornado', ingredients: [] }
    ];
    console.log('recipes in memory ', recipes);
    return {recipes};
  }

  genId(recipes: Recipe[]): number {
    return recipes.length > 0 ? Math.max(...recipes.map(recipe => recipe.id)) + 1 : 11;
  }

}
