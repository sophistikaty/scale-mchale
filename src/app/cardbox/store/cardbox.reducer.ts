import { Recipe } from '../../types/recipe';
import * as Cardbox from './cardbox.actions';

export interface CardboxState {
    selected: Recipe;
    recipes: Recipe[];
  }

  const initialRecipe = new Recipe();

  export const initialState: CardboxState = {
    selected: initialRecipe,
    recipes: [initialRecipe],
  };

  export function cardboxReducer(
    state = initialState,
    action: Cardbox.ActionsUnion
  ): CardboxState {
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
