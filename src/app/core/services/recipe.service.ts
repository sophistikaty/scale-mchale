import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as elasticsearch from 'elasticsearch-browser';
import { Observable, BehaviorSubject, of } from 'rxjs';

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

  private apiKeys = this.appConfig.config.apiKeys;
  private recipesUrl = 'api/recipe';

  private client: elasticsearch.Client;

  recipes$;
  selectedRecipe$;
  cast;

  private connect() {
    this.client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
    });
  }

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

  // getRecipes(): Observable<Recipe[]> {
  //   console.log('adding recipe');
  //   this.nutritionService.add('mock nutrition from recipe');
  //   return this.http.get<Recipe[]>(this.recipesUrl)
  //     .pipe(
  //       tap(_ => console.log('fetched recipes', _)),
  //       catchError(this.handleError('getRecipes', []))
  //     );
  // }

  updateRecipe (recipe: Recipe) {
  //   return this.http.put(this.recipesUrl, recipe, httpOptions).pipe(
  //     tap(_ => console.log(`updated recipe id=${recipe.id}`, _)),
  //     catchError(this.handleError<any>('updateRecipe'))
  //   );
  }

 // ingestion / parsing

  getIngredientQuantity (text: string): number {
    return this.conversionService.toNumber(text);
  }

  notBlank(term: string): boolean {
    return term !== '';
  }

  removeSubstr(fullString: string, substring: string): string {
    return substring === '' ? fullString : fullString.split(substring).reverse().find(this.notBlank);
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
    let measurement: string;
    const measureConvert = this.conversionService.getConversions();
    const existingMeasurement = Object.keys(measureConvert).find(function(measurement) {
    return measureConvert[measurement].aliases.find(function(alias) {
      return ingredientText.indexOf(alias) !== -1;
      });
    });

    if (existingMeasurement) {
      measurement = existingMeasurement;
    } else {
      measurement = ingredientText.indexOf('of') ? this.textQuantity(ingredientText) : this.addIngredientMeasurement(ingredientText);
    }
    return measurement;
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

  getRecipeId(dataHit) {
    const { image, uri, url, shareAs } = dataHit;
    const uniqueUrl = uri || url || shareAs || image;
    return /(\w*)$/.exec(uniqueUrl).pop();
  }

  //search

  searchRecipes(searchInput: string) {
    const edamam = 'https://api.edamam.com/search';
    const accessConfig = `&app_id=${this.apiKeys.edamam.app_id}&app_key=${this.apiKeys.edamam.app_key}`;
    const edamamReqUrl = `${edamam}?q=${searchInput}${accessConfig}`;

    return this.http.get(edamamReqUrl);
  }

  mapToRecipes (data) {
    const service = this;
    const { hits = [] } = data;
    return hits.map(function(hit) {
      const recipe = hit && hit.recipe;
      const { label, ingredientLines, image } = recipe;
      const id = service.getRecipeId(recipe);
      const ingredients = service.textToIngredients(ingredientLines);
      return new Recipe(id, label, ingredients, image);
    });
  }

  //crud, get-set

  addRecipe(recipe: Recipe){
    const recipeLib = this.getLocalStorageRecipes();
    recipeLib[recipe.id] = recipe;
    this.updateSavedRecipes(recipeLib);
  }

  deleteRecipe(recipe:Recipe) {
    const recipeLib = this.getLocalStorageRecipes();
    delete recipeLib[recipe.id];
    this.updateSavedRecipes(recipeLib);
  }

  updateSavedRecipes( library: object ) {
    sessionStorage.setItem('recipes', JSON.stringify(library));
    const recipeArr = this.getLocalStorageRecipeArr(library);

    this.recipes$.next(recipeArr);

    const selectedRecipe = this.selectedRecipe$.getValue();
    const hasSelectedRecipe = selectedRecipe && recipeArr.find(recipe => recipe.id === selectedRecipe.id);

    if (hasSelectedRecipe) {
      return;
    }
    this.setSelectedRecipe(recipeArr.pop());
  }

  setSelectedRecipe(recipe: Recipe): void {
    this.selectedRecipe$.next(recipe);
  }

  getSelectedRecipe(): Recipe {
    return this.selectedRecipe$ ? this.selectedRecipe$.getValue() : this.recipes$.getValue().find(r => r);
  }

  getRecipe(id: string): Observable<Recipe> {
    const idRecipe = this.getLocalStorageRecipes()[id] || {};
    const idRecipe$ = new BehaviorSubject<Recipe>(idRecipe);
    this.cast = idRecipe$.asObservable();
    return idRecipe$;
 }

  getLocalStorageRecipes(): object {
    return JSON.parse(sessionStorage.getItem('recipes')) || {};
  }

  getLocalStorageRecipeArr(recipesIn ?: object): Recipe[] {
    const recipeLib = recipesIn || this.getLocalStorageRecipes();
    return Object.keys(recipeLib).map(function(recipeId: string): Recipe {
      const localRecipe = recipeLib[recipeId];
      localRecipe.ingredients = localRecipe.ingredients as Ingredient[];
      return localRecipe as Recipe;
    });
  }

  constructor(private appConfig: AppConfig,
    private http: HttpClient,
    private nutritionService: NutritionService,
    private conversionService: ConversionService) {
      this.recipes$ = new BehaviorSubject<Recipe[]>(this.getLocalStorageRecipeArr());
      this.cast = this.recipes$.asObservable();

      this.selectedRecipe$ = new BehaviorSubject<Recipe>(this.getSelectedRecipe());
      this.cast = this.selectedRecipe$.asObservable();

      this.connect();
      this.client.ping({
        requestTimeout: Infinity,
        body: 'hello JavaSampleApproach!'
      });
    }
}
