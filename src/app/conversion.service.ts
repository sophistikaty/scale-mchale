import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConversionService {

  conversions: object = {
    drops: { name: 'drops', base: 1, teaspoon: 0.01, tablespoon: 0.0033, cup: 0.0002,
      aliases: ['drops']
    },
    teaspoon: { name: 'teaspoon', base: 1, drops: 100, tablespoon: 0.3333, cup: 0.0208,
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

  constructor() { }
}
