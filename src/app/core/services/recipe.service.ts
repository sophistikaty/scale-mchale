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
  private selectedRecipe: Recipe;

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

  getIngredientQuantity (text: string): number {
    return this.conversionService.toNumber(text);
  }

  notBlank(term: string): boolean {
    return term !== '';
  }

  removeSubstr(fullString: string, substring: string): string {
    return fullString.split(substring).reverse().find(this.notBlank);
  }

  textQuantity(text: string): string {
    const [ numberMatch = '' ] = /([[1-9][0-9]*\s*]?)[1-9][0-9]*\/[1-9][0-9]*/g.exec(text)
    || /[1-9][0-9]*/g.exec(text) || [];
    return numberMatch;
  }

  cleanSingular(term: string): string {
    const sIndex = term.indexOf('s');
    const isPlural = sIndex === term.length - 1;
    return isPlural ? term.slice(0, sIndex) : term;
  }

  cleanExtraChars(text: string) {
    const singularText = this.cleanSingular(text);

    const trailingSMatch = /^s\s*/.exec(singularText) || [];
    const trailingSRemoved = this.removeSubstr(singularText, trailingSMatch[0]);

    const trailingParenMatch = /\)\s*/.exec(trailingSRemoved) || [];

    return this.removeSubstr(trailingSRemoved, trailingParenMatch[0]);
  }

  addIngredientMeasurement(ingredientText: string): string {
    const fullTextQuantity = this.textQuantity(ingredientText);
    const textWithoutQuantity = ingredientText.slice(ingredientText.indexOf(fullTextQuantity) + fullTextQuantity.length);
    const measurementName = this.cleanExtraChars(textWithoutQuantity.split(' ').find(function(term) {
      return term !== '';
    }));
    // need a measurement conversion generator service?
    this.conversionService.addMeasurement(measurementName);
    return measurementName;
  }

  getIngredientMeasure (ingredientText: string): string {
    const measureConvert = this.conversionService.getConversions();
    const existingMeasurement = Object.keys(measureConvert).find(function(measurement) {
    return measureConvert[measurement].aliases.find(function(alias) {
      return ingredientText.indexOf(alias) !== -1;
      });
    });
    return existingMeasurement ? existingMeasurement : this.addIngredientMeasurement(ingredientText);
  }

  getIngredientFood (ingredientText: string, measure: string) {
    const measureCleaned = this.removeSubstr(ingredientText, measure);
    const secondaryQuantity = this.textQuantity(measureCleaned);
    const secondaryMeas = secondaryQuantity !== '' && this.getIngredientMeasure(measureCleaned);
    const secondaryQMCleaned = !secondaryMeas ? measureCleaned :
      this.removeSubstr(this.removeSubstr(measureCleaned, secondaryQuantity), secondaryMeas);
    return this.cleanExtraChars(secondaryQMCleaned);
  }

  textToIngredients(textArray: string[]): Ingredient[] {
    const service = this;
    return textArray.map(function(ingredientText: string) {
      const quantity = service.getIngredientQuantity(ingredientText);
      const measure = service.getIngredientMeasure(ingredientText);
      const food = service.getIngredientFood(ingredientText, measure);
      return new Ingredient(ingredientText, quantity, measure, food);
    });
  }

  updateSavedRecipes( library: object ) {
    sessionStorage.setItem('recipes', JSON.stringify(library));
  }

  mapToRecipes (data) {
    const service = this;
    const { hits = [] } = data;
    return hits.map(function(hit, index: number) {
      const { label, ingredientLines, image, uri, url, shareAs } = hit && hit.recipe;
      const id = uri || url || shareAs || image;
      const ingredients = service.textToIngredients(ingredientLines);
      return new Recipe(id, label, ingredients, image);
    });
  }

  searchRecipes(searchInput: string) {
    const edamam = 'https://api.edamam.com/search';
    const accessConfig = `&app_id=${this.apiKeys.edamam.app_id}&app_key=${this.apiKeys.edamam.app_key}`;
    const edamamReqUrl = `${edamam}?q=${searchInput}${accessConfig}`;

    return this.http.get(edamamReqUrl);
  }

  getLocalStorageRecipeArr(): Recipe[] {
    const recipeLib: object = JSON.parse(sessionStorage.getItem('recipes')) || {};
    return Object.keys(recipeLib).map(function(recipeId: string): Recipe {
      const localRecipe = recipeLib[recipeId];
      localRecipe.ingredients = localRecipe.ingredients as Ingredient[];
      return localRecipe as Recipe;
    });
  }

  setupLocalDefault() {
    this.recipes = this.getLocalStorageRecipeArr();
    this.selectedRecipe = this.recipes.pop();
  }

  setSelectedRecipe(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  getSelectedRecipe(): Recipe {
    if (!this.selectedRecipe) {
      this.setupLocalDefault();
    }
    return this.selectedRecipe;
  }

  constructor(private appConfig: AppConfig,
    private http: HttpClient,
    private nutritionService: NutritionService,
    private conversionService: ConversionService) {
  }
}
