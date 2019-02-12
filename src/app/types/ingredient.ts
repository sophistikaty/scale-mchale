export class Ingredient {

    text: string;
    quantity: number;
    prevQuantity: number;
    measure: string;
    prevMeasure: string;

    constructor(text: string = '',
                quantity: number = 1,
                measure: string = '') {
      this.text = text;
      this.quantity = quantity;
      this.prevQuantity = this.quantity;
      this.measure = measure;
      this.prevMeasure = this.measure;
    }
}
