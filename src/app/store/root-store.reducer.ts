import { Action } from '@ngrx/store';
import { Recipe } from '../types/recipe';

import * as Cardbox from '../cardbox/store/cardbox.actions';

export interface State {
    selected: Recipe;
    recipes: Recipe[];
  }

  export const initialState: State = {
    selected: new Recipe(),
    recipes: [this.selected],
  };

  export function reducer(
    state = initialState,
    action: Cardbox.ActionsUnion
  ): State {
    switch (action.type) {
      case Cardbox.ActionTypes.Select: {
        return {
          ...state,
          selected: state.selected,
        };
      }
      case Cardbox.ActionTypes.Delete: {
        return {
          ...state,
          recipes: state.recipes,
        };
      }

      default: {
        return state;
      }
    }
  }

// export function selectedReducer(selectedState: Recipe = initialState.selected, selectedAction: Action) {
//   switch (selectedAction.type) {
//     case ActionTypes.Select:
//       return selectedState;

//     default:
//       return selectedState;
//   }
// }

// export function cardboxReducer(cardboxState: Recipe[] = initialState.recipes, cardBoxAction: Action) {
//   switch (cardBoxAction.type) {
//     case ActionTypes.Delete:
//       return cardboxState;

//     default:
//       return cardboxState;
//   }
// }
