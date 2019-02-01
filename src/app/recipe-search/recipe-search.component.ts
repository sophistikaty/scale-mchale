import { Component, OnInit, Input } from '@angular/core';
// import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RecipeService } from '../core/services/recipe.service';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  @Input() searchInput: string;

  onSearch() {
    if (!this.searchInput) {
      return;
    }
    this.recipeService.searchRecipes(this.searchInput)
    .pipe(debounceTime(500)).subscribe(res => console.log('search response ', res));
  }

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }

}
