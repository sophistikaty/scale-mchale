import { Component, OnInit, Input } from '@angular/core';
import { RecipeService } from '../core/services/recipe.service';
import { fromEvent, Observable } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

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
    console.log('searching');
    // return this.recipeService.searchRecipes(this.searchInput)
    // .pipe(debounceTime(500)).subscribe(
    //   function(res) {
    //     // const { hits = []} = res;
    //     this.searchResults = res;
    //     this.prevInput = this.searchInput;
    //   });
  }

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    fromEvent(document, 'keyup')
    .pipe(map(event => console.log(`Event time: ${event.timeStamp}, ${this.searchInput}`)))
    .subscribe(val => console.log(val));
  }

}
