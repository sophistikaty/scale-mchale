import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Select, Delete } from './store/cardbox.actions';
import { Recipe } from '../types/recipe';
import { RecipeService } from '../core/services/recipe.service';


@Component({
  selector: 'app-cardbox',
  templateUrl: './cardbox.component.html',
  styleUrls: ['./cardbox.component.scss']
})
export class CardboxComponent implements OnInit {
  cardbox$: Observable<any>;

  selectRecipe(recipe: Recipe): void {
    this.recipeService.setSelectedRecipe(recipe);
  }

  deleteRecipe(recipe: Recipe) {
    this.store.dispatch( new Delete({recipe}) );
    // this.recipeService.deleteRecipe(recipe);
  }

  constructor(private recipeService: RecipeService,
    private store: Store<{ recipes: Recipe[] }>) {

    this.cardbox$ = store.pipe(select('cardbox'));
  }
  ngOnInit() {}
}
