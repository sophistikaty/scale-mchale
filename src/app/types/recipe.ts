import { Ingredient } from './ingredient';

export class Recipe {

  id: number;
  name: string;
  ingredients: Ingredient[];
  imageUrl: string;

  constructor(id: number = null,
              name: string = 'blankName',
              ingredients: Ingredient[] = [],
              imageUrl: string = 'noImage') {
    this.id = id;
    this.name = name;
    this.ingredients = ingredients;
    this.imageUrl = imageUrl;
  }
}
