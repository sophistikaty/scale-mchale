export class Recipe {

  id: number;
  name: string;
  ingredients: string[];
  imageUrl: string;

  constructor(id: number = null,
              name: string = 'blankName',
              ingredients: string[] = [],
              imageUrl: string = 'noImage') {
    this.id = id;
    this.name = name;
    this.ingredients = ingredients;
    this.imageUrl = imageUrl;
  }
}
