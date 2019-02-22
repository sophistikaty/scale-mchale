import { Component, OnInit, Input } from '@angular/core';
import { RecipeService } from '../core/services/recipe.service';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Recipe } from '../types/recipe';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  @Input() searchInput: string;

  public searchResults: Recipe[];

  addToMyRecipes( recipe: Recipe ) {
    this.recipeService.addRecipe(recipe);
  }

  onSearch() {
    const component = this;
    if (!this.searchInput) {
      return;
    }
    return this.recipeService.searchRecipes(this.searchInput)
    .subscribe(
      function(response) {
        component.searchResults = component.recipeService.mapToRecipes(response) || [];
      });
  }

  private initInputObserver() {
    fromEvent(document.querySelector('#recipeSearch'), 'keyup')
    .pipe(debounceTime(500), distinctUntilChanged(),
      map(() => this.onSearch()))
    .subscribe();
  }

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.initInputObserver();
  }
}
