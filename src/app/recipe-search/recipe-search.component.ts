import { Component, OnInit, Input } from '@angular/core';
// import { Observable, of } from 'rxjs';
// import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { RecipeService } from '../core/services/recipe.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.scss']
})
export class RecipeSearchComponent implements OnInit {
  @Input() searchInput: string;
  private prevInput: string;
  public searchResults: object[];

  onSearch() {
    if (!this.searchInput || this.searchInput === this.prevInput) {
      return;
    }
    return this.recipeService.searchRecipes(this.searchInput)
    .pipe(debounceTime(500)).subscribe(
      function(res) {
        // const { hits = []} = res;
        this.searchResults = res;
        this.prevInput = this.searchInput;
      });
  }

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {}

}
