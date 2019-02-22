import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/types/recipe';
import { Ingredient } from 'src/app/types/ingredient';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  oneHundred =  100;

  conversions: object = {
    drop: { name: 'drop', base: 1, teaspoon: 0.01, tablespoon: 0.0033, cup: 0.0002,
      aliases: ['drop', 'drops']
    },
    teaspoon: { name: 'teaspoon', base: 1, drop: this.oneHundred, tablespoon: 0.3333, cup: 0.0208,
      aliases: ['teaspoon', 'teaspoons', 'tsp', 'tsps']
    },
    tablespoon: { name: 'tablespoon', base: 1, drop: 3 * this.oneHundred, teaspoon: 3, cup: 0.0625,
      aliases: ['tablespoon', 'tablespoons', 'tbsp', 'tbsps']
    },
    cup: { name: 'cup', base: 1, drop: 4800, teaspoon: 48, tablespoon: 16,
      aliases: ['cup', 'cups']
    }
  };

  getConversions(): object {
    return this.conversions;
  }

  getFloatFromTextFraction (text: string) {
    // [[1-9][0-9]*\s*]?) integer preceding fraction
    const [ textInteger = null ] = /[[1-9][0-9]*\s*?]*/g.exec(text) || [];
    // [1-9][0-9]*\/[1-9][0-9]* fraction
    const [ textFraction = null ] = /[1-9][0-9]*\/[1-9][0-9]*/g.exec(text) || [];

    if ( !textFraction ) {
      return parseInt(textInteger);
    }

    const [ dividend = null, divisor = null ] = textFraction.split('/') || [];
    const float = parseInt(textInteger)
    ? ( (parseInt(textInteger) * parseInt(divisor)) + parseInt(dividend)) / parseInt(divisor)
    : parseInt(dividend) / parseInt(divisor)
    return float;
  }

  toNumber(text: string): number {
    return this.getFloatFromTextFraction(text) || parseInt(text);
  }

  quantityChanged(recipe: Recipe, index: number ) {
    const convertIngredient = recipe.ingredients[index];
    convertIngredient.quantity = this.toNumber(convertIngredient.quantity.toString());

    const multiplier = convertIngredient.quantity / convertIngredient.prevQuantity;
    for ( const ingredient of recipe.ingredients ){
      ingredient.quantity = Math.round((ingredient.prevQuantity * multiplier) * this.oneHundred) / this.oneHundred;
      ingredient.prevQuantity = ingredient.quantity;
    }
  }

  convertMeasurement ( ingredient: Ingredient ) {
    const multiplier = this.conversions[ ingredient.prevMeasure ][ ingredient.measure ];
    ingredient.quantity =  Math.round((multiplier * ingredient.quantity) * this.oneHundred) / this.oneHundred;

    ingredient.prevMeasure = ingredient.measure;
    ingredient.prevQuantity = ingredient.quantity;
  }

  addMeasurement(name: string): object {
    this.conversions[name] = {
      name,
      base: 1,
      aliases: [name, `${name}s`]
    };
    return this.conversions;
  }

  constructor() { }
}
