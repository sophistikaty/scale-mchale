export class Ingredient {

    originalText: string;
    quantity: number;
    prevQuantity: number;
    measure: string;
    prevMeasure: string;
    food: string;

    constructor(originalText: string = '',
                quantity: number = 1,
                measure: string = '',
                food: string = '') {
      this.originalText = originalText;
      this.quantity = quantity;
      this.prevQuantity = this.quantity;
      this.measure = measure;
      this.prevMeasure = this.measure;
      this.food = food;
    }
}
