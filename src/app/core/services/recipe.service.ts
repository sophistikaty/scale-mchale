import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Recipe } from '../../types/recipe';
import { NutritionService } from './nutrition.service';
import { ConversionService } from './conversion.service';
import { AppConfig } from 'src/app/app.config';
import { Ingredient } from 'src/app/types/ingredient';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class RecipeService {

  recipes: Recipe[];
  private apiKeys = this.appConfig.config.apiKeys;
  private recipesUrl = 'api/recipe'; 

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    // console.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

   getRecipe(id: number): Observable<Recipe> {
    const url = `${this.recipesUrl}/${id}`;
    return this.http.get<Recipe>(url).pipe(
      tap(_ => console.log(`fetched recipe id=${id}`, _)),
      catchError(this.handleError<Recipe>(`getRecipe id=${id}`))
    );
  }

  getRecipes(): Observable<Recipe[]> {
    console.log('adding recipe');
    this.nutritionService.add('mock nutrition from recipe');
    return this.http.get<Recipe[]>(this.recipesUrl)
      .pipe(
        tap(_ => console.log('fetched recipes', _)),
        catchError(this.handleError('getRecipes', []))
      );
  }

  updateRecipe (recipe: Recipe): Observable<any> {
    return this.http.put(this.recipesUrl, recipe, httpOptions).pipe(
      tap(_ => console.log(`updated recipe id=${recipe.id}`, _)),
      catchError(this.handleError<any>('updateRecipe'))
    );
  }

  getFloatFromTextFraction (text: string) {
    const [textFraction = null] = /[1-9][0-9]*\/[1-9][0-9]*/g.exec(text) || [];
    const [dividend = null, divisor = null] = textFraction && textFraction.split('/') || [];
    return parseInt(dividend)/parseInt(divisor);
  };

  getIngredientQuantity (text: string) {
    return this.getFloatFromTextFraction(text) || parseInt(text);
  }

  getIngredientMeasure (text: string) {
    const measureConvert = this.conversionService.getConversions();
    const existingMeasurement = Object.keys(measureConvert).find(function(measurement){
    return measureConvert[measurement].aliases.find(function(alias){
      return text.indexOf(alias) !== -1;
      });
    });
    return existingMeasurement;
    // ? existingMeasurement : addIngredientMeasurement(ingredient);
  }

  textToIngredients(textArray: string[]): Ingredient[] {
    const service = this;
    return textArray.map(function(ingredient: string) {
      const quantity = service.getIngredientQuantity(ingredient);
      const measure = service.getIngredientMeasure(ingredient);
      return new Ingredient(ingredient, quantity);
    });
  }

  mapToRecipes (data) {
    const service = this;
    const { hits = [] } = data;
    return hits.map(function(hit, index: number) {
      const { label, ingredientLines, image } = hit && hit.recipe;
      const ingredients = service.textToIngredients(ingredientLines);
      return new Recipe(index, label, ingredients, image);
    });
  }

  searchRecipes(searchInput: string) {
    const edamam = 'https://api.edamam.com/search';
    const accessConfig = `&app_id=${this.apiKeys.edamam.app_id}&app_key=${this.apiKeys.edamam.app_key}`;
    const edamamReqUrl = `${edamam}?q=${searchInput}${accessConfig}`;

    return this.http.get(edamamReqUrl);
  }

  constructor(private appConfig: AppConfig,
    private http: HttpClient,
    private nutritionService: NutritionService,
    private conversionService: ConversionService) {
  }
}
