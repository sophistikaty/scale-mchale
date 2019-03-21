import { Action } from '@ngrx/store';
import { Recipe } from '../types/recipe';

export enum ActionTypes {
  Select = '[Cardbox Component] Select',
  Delete = '[Cardbox Component] Delete',
}

export class Select implements Action {
  readonly type = ActionTypes.Select;
}

export class Delete implements Action {
  readonly type = ActionTypes.Delete;
  constructor(public payload: { recipe: Recipe }) {}
}

export type ActionsUnion = Select | Delete;