import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/types/recipe';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  oneHundred =  100;

  conversions: object = {
    drops: { name: 'drops', base: 1, teaspoon: 0.01, tablespoon: 0.0033, cup: 0.0002,
      aliases: ['drops']
    },
    teaspoon: { name: 'teaspoon', base: 1, drops: this.oneHundred, tablespoon: 0.3333, cup: 0.0208,
      aliases: ['teaspoon', 'tsp']
    },
    tablespoon: { name: 'tablespoon', base: 1, drops: 300, teaspoon: 3, cup: 0.0625,
      aliases: ['tablespoon']
    },
    cup: { name: 'cup', base: 1, drops: 4800, teaspoon: 48, tablespoon: 16,
      aliases: ['cup']
    }
  };

  getConversions(): object {
    return this.conversions;
  }

  getFloatFromTextFraction (text: string) {
    const [textFraction = null] = /[1-9][0-9]*\/[1-9][0-9]*/g.exec(text) || [];
    const [dividend = null, divisor = null] = textFraction && textFraction.split('/') || [];
    return parseInt(dividend)/parseInt(divisor);
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

  addMeasurement(measurementName: string): object {
    this.conversions[measurementName] = {
      name: measurementName,
      base: 1,
      aliases: [measurementName]
    };

    return this.conversions;
  }

  constructor() { }
}
