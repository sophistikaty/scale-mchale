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

  mapToRecipes (data) {
    const { hits = [] } = data;
    return hits.map(function(hit, index: number) {
      const { label, ingredientLines, image } = hit && hit.recipe;
      return new Recipe(index, label, ingredientLines, image);
    });
  }

  onSearch() {
    const component = this;
    if (!this.searchInput) {
      return;
    }
    return this.recipeService.searchRecipes(this.searchInput)
    .subscribe(
      function(response) {
        component.searchResults = component.mapToRecipes(response) || [];
      });
  }

  private initInputObserver() {
    fromEvent(document, 'keyup')
    .pipe(debounceTime(500), distinctUntilChanged(),
      map(() => this.onSearch()))
    .subscribe();
  }

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.initInputObserver();
  }
}
