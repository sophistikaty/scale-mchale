import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { cardboxReducer } from './store/cardbox.reducer';

@NgModule({
  imports: [StoreModule.forFeature('cardbox', cardboxReducer)],
})
export class CardboxModule {}