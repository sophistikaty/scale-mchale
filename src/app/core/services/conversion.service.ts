import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/types/recipe';
import { Ingredient } from 'src/app/types/ingredient';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  oneHundred =  100;
  eight = 8;
  six = 6;
  two = 2;
  one = 1;

  conversions: object = {
    cup: { name: 'cup', base: this.one,
      drop: this.six * this.eight * this.oneHundred, ounce: this.eight, teaspoon: this.six * this.eight, tablespoon: this.two * this.eight,
      aliases: ['cup', 'cups']
    },
    drop: { name: 'drop', base: this.one,
      ounce: 0.001667, teaspoon: this.one / this.oneHundred, tablespoon: 0.0033, cup: 0.0002,
      aliases: ['drop', 'drops']
    },
    ounce: { name: 'ounce', base: this.one,
      cup: 0.125, drop: this.six * this.oneHundred, teaspoon: this.six, tablespoon: this.two,
      aliases: ['ounce', 'ounces', 'oz']
    },
    teaspoon: { name: 'teaspoon', base: 1,
      drop: this.oneHundred, ounce: 0.1667, tablespoon: 0.3333, cup: 0.0208,
      aliases: ['teaspoon', 'teaspoons', 'tsp', 'tsps']
    },
    tablespoon: { name: 'tablespoon', base: 1,
      drop: 3 * this.oneHundred, ounce: this.one / this.two , teaspoon: 3, cup: 0.0625,
      aliases: ['tablespoon', 'tablespoons', 'tbsp', 'tbsps']
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
